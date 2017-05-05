'use strict';
var _ = require('lodash'),
    BB = require('bluebird'),
    db = require('../../db')(),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    querystring = require('querystring'),
    crypto = require('../../utils/crypto'),
    strings = new Strings('en'),
    profileFieldsArr = config.identities.instagram.profileFields,
    profileFields = (_.isArray(profileFieldsArr)) ? profileFieldsArr.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale';

module.exports = {
    auth: function(options) {
        return BB.bind({ userInfo: null, options:options.raw })
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

// Function will look up a user by their social id and then assign it to the userInfo object
function _setUserInfoFromSocialAccount(){
    return db.users.socialAuthentication('instagram', this.options.user.id)
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
        return _linkIdentity(this.userInfo._id, 'instagram', this.options);
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
        nameparts = this.options.user.full_name.split(' '),
        newUser = {
        role: 'external',
        identities: {
            instagram: {
                id: this.options.user.id,
                accessToken: this.options.access_token,
                screen_name: this.options.user.username
            }
        },
        linkedidentities: ['instagram'],
        profile: {
            picture: this.options.user.profile_picture
        },
        enabled: true,
        email: '',
        firstname: nameparts[0],
        displayname: this.options.user.username,
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
function _linkIdentity(userId, key, creds) {
    var identityOptions = {
            id: creds.user.id,
            accessToken: creds.access_token,
            screen_name: creds.user.username
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
            type: 'instagram'
        };

    return db.tokens.insert(newTokenObj).then(function() { return token; });
}
