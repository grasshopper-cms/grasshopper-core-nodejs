'use strict';
var _ = require('lodash'),
    BB = require('bluebird'),
    db = require('../../db')(),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    Purest = require('purest'),
    crypto = require('../../utils/crypto'),
    twitter = new Purest({promise: true, provider:'twitter', key: config.identities.twitter.key, secret: config.identities.twitter.secret}),
    querystring = require('querystring'),
    strings = new Strings('en'),
    profileFieldsArr = config.identities.twitter.profileFields,
    profileFields = (_.isArray(profileFieldsArr)) ? profileFieldsArr.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale';

module.exports = {
    auth: function(options) {
        return BB.bind({ socialUserInfo: null, userInfo: null, options:options.raw })
                .then(_getUserSocialDetails)
                .then(_setUserInfoFromSocialAccount)
                .then(_linkOrCreateUser)
                .then(_createNewToken)
                .catch(function(err) {
                    var e = new Error(err.message);
                    e.code = strings.group('codes').forbidden;
                    throw(err);
                });
    }
};


// Function will obtian the user's social information from facebook and return it
// as user info to our promise chain. This info can later be used to look up our
// users a either create an account or log them in
function _getUserSocialDetails() {
    return twitter.query()
            .get('users/show')
            .qs({screen_name:this.options.screen_name})
            .auth(this.options.oauth_token, this.options.oauth_token_secret)
            .request()
            .then(function(res){
                this.socialUserInfo = res[1]; //Response is an array. 2nd element is the body
            }.bind(this));
}

// Function will look up a user by their social id and then assign it to the userInfo object
function _setUserInfoFromSocialAccount(){
    return db.users.socialAuthentication('twitter', this.socialUserInfo.id_str)
            .then(function(user){
                this.userInfo = user;
            }.bind(this))
            .catch(function(err){ // If user isn't found surpress error. If found and still error then throw.
                if(err.code !== 404){
                    throw(err);
                }
            });
}

// This function will take an social identity and assign it to a user.
function _linkOrCreateUser() {
    if(this.userInfo){ //If user exists link data
        return _linkIdentity(this.userInfo._id, 'twitter', this.socialUserInfo, this.options);
    }
    else {
        return _createUser.call(this)
                .then(function(user){
                    this.userInfo = user;
                }.bind(this));
    }
}

// Function will create a user if it doesn't exist. If the same email is found
// then we will throw an error. Because we should never "create" a new user with
// an email address that is already in the system. Accounts like this should be "linked".
function _createUser(){
    var excludedFields = ['name', 'screen_name', 'profile_image'],
        nameparts = this.socialUserInfo.name.split(' '),
        newUser = {
        role: 'external',
        identities: {
            twitter: {
                id: this.socialUserInfo.id_str,
                accessToken: this.options.oauth_token,
                accessSecret: this.options.oauth_token_secret,
                screen_name: this.socialUserInfo.screen_name
            }
        },
        linkedidentities: ['twitter'],
        profile: {
            picture: this.socialUserInfo.profile_image_url
        },
        enabled: true,
        email: '',
        displayname: this.socialUserInfo.screen_name,
        firstname: nameparts[0],
        lastname: (nameparts.length > 1) ? nameparts[1] : ' '
    };

    _.each(profileFieldsArr, function(field){
        if(excludedFields.indexOf(field) === -1){
            newUser.profile[field] = this.socialUserInfo[field];
        }
    }.bind(this));

    return db.users.insert(newUser);
}

// When a user is already in the system and the email matches, then we would
// update their social data with the newly supplied info.
function _linkIdentity(userId, key, socialUserInfo, creds) {
    var identityOptions = {
            id: socialUserInfo.id_str,
            screen_name: socialUserInfo.screen_name,
            accessToken: creds.oauth_token,
            accessSecret: creds.oauth_token_secret
        };

    return db.users.linkIdentity(userId, key, identityOptions);
}


// Function will create a new access token in grasshopper and return it to the app
function _createNewToken() {
    var token = uuid.v4(),
        newTokenObj = {
            _id: crypto.createHash(token, config.crypto.secret_passphrase),,
            uid: this.userInfo._id.toString(),
            created: new Date().toISOString(),
            type: 'twitter'
        };

    return db.tokens.insert(newTokenObj).then(function() { return token; });
}
