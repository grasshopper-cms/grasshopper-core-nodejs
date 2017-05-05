'use strict';
var _ = require('lodash'),
    BB = require('bluebird'),
    db = require('../../db')(),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    Purest = require('purest'),
    facebook = new Purest({ provider:'facebook', promise: true }),
    querystring = require('querystring'),
    graph = require('fbgraph'),
    strings = new Strings('en'),
    crypto = require('../../utils/crypto'),
    appId = config.identities.facebook.key,
    secret = config.identities.facebook.secret,
    scope = config.identities.facebook.scope,
    profileFieldsArr = config.identities.facebook.profileFields,
    profileFields = (_.isArray(profileFieldsArr)) ? profileFieldsArr.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale';

module.exports = {
    auth: function(options) {
        return BB.bind({ creds: null, socialUserInfo: null, userInfo: null, options:options })
                .then(_getPersistantFacebookToken)
                .then(_getUserDetailsFromFacebook)
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

// Function will accept the passed in authentication token from FB and exchange
// it for a permenant token. This token will be saved to the user's identities profile.
function _getPersistantFacebookToken(){
    return facebook.query()
            .get('/oauth/access_token?' +
                'grant_type=fb_exchange_token&' +
                'client_id=' + appId + '&' +
                'client_secret=' + secret + '&' +
                'fb_exchange_token=' + this.options.code)
            .request()
            .then(function (res) {
                // Bad tokens result in a 200 with an error object
                if (res[1].error) {
                    throw new Error(res[1].error.message);
                }

                this.creds = querystring.parse(res[1]);
            }.bind(this));
}

// Function will obtian the user's social information from facebook and return it
// as user info to our promise chain. This info can later be used to look up our
// users a either create an account or log them in
function _getUserDetailsFromFacebook() {
    return facebook.query()
            .get('me?fields=' + profileFields)
            .auth(this.options.code)
            .request()
            .then(function(res){
                this.socialUserInfo = res[1];
            }.bind(this));
}

// Function will look up a user by their social id and then assign it to the userInfo object
function _setUserInfoFromSocialAccount(){
    return db.users.socialAuthentication('facebook', this.socialUserInfo.id)
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
        return _linkIdentity(this.userInfo._id, 'facebook', this.socialUserInfo, this.creds);
    }
    else {
        return _createNewFacebookUser.call(this)
                .then(function(user){
                    this.userInfo = user;
                }.bind(this));
    }
}

// Function that takes the facebook social data and attaches it to a user in grasshopper
function _createNewFacebookUser() {
    var avatar = '',
        excludedFields = ['link', 'email', 'first_name', 'last_name','picture'],
        newUser;

    //Set Image
    if(this.socialUserInfo.picture && this.socialUserInfo.picture.data && this.socialUserInfo.picture.data.url !== ''){
        avatar = this.socialUserInfo.picture.data.url;
    }

    newUser = {
        role: 'external',
        identities: {
            facebook: {
                id: this.socialUserInfo.id,
                accessToken: this.creds.access_token,
                expiresIn: this.creds.expires
            }
        },
        linkedidentities: ['facebook'],
        profile: {
            picture: avatar
        },
        enabled: true,
        email: this.socialUserInfo.email,
        firstname: this.socialUserInfo.first_name,
        lastname: this.socialUserInfo.last_name
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
            id: socialUserInfo.id,
            accessToken: creds.access_token,
            expires: creds.expires
        };

    return db.users.linkIdentity(userId, key, identityOptions);
}


// Function will create a new access token in grasshopper and return it to the app
function _createNewToken() {
    var token = uuid.v4(),
        newTokenObj = {
            _id: crypto.createHash(token, config.crypto.secret_passphrase),
            uid: this.userInfo._id.toString(),
            created: new Date().toISOString(),
            type: 'facebook'
        };

    return db.tokens.insert(newTokenObj).then(function() { return token; });
}
