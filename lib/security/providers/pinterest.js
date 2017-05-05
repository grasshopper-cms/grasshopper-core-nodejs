'use strict';
var _ = require('lodash'),
    BB = require('bluebird'),
    db = require('../../db')(),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    crypto = require('../../utils/crypto'),
    Purest = require('purest'),
    pinterest = new Purest({
        provider:'pinterest',
        promise: true,
        key: config.identities.pinterest.key,
        secret: config.identities.pinterest.secret,
        config: {
            "pinterest": {
                "https://api.pinterest.com": {
                    "__domain": {
                        "auth": {
                            "auth": {
                                "bearer": "[0]"
                            }
                        }
                    },
                    "[version]/{endpoint}": {
                        "__path": {
                            "alias": "__default",
                            "version": "v1"
                        }
                    }
                }
            }
        }
    }),
    querystring = require('querystring'),
    strings = new Strings('en'),
    profileFieldsArr = config.identities.instagram.profileFields,
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

function _getUserSocialDetails(){
    return pinterest
                .query()
                .get('me/?fields=id,first_name,last_name,url,username,image&access_token=' + this.options.access_token)
                .request()
                .then(function(res){
                    this.socialUserInfo = res[1].data;
                }.bind(this));
}

// Function will look up a user by their social id and then assign it to the userInfo object
function _setUserInfoFromSocialAccount(){
    return db.users.socialAuthentication('pinterest', this.socialUserInfo.id)
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
        return _linkIdentity(this.userInfo._id, 'pinterest', this.socialUserInfo, this.options);
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
    var newUser = null,
        avatar = '';

        if(this.socialUserInfo.image['60x60']){
            avatar = this.socialUserInfo.image['60x60'].url;
        }

        newUser = {
            role: 'external',
            identities: {
                pinterest: {
                    id: this.socialUserInfo.id,
                    accessToken: this.options.access_token,
                    screen_name: this.socialUserInfo.username
                }
            },
            linkedidentities: ['pinterest'],
            profile: {
                picture: avatar
            },
            displayname: this.socialUserInfo.username,
            enabled: true,
            email: '',
            firstname: this.socialUserInfo.first_name,
            lastname: this.socialUserInfo.last_name
        };

    return db.users.insert(newUser);
}

// When a user is already in the system and the email matches, then we would
// update their social data with the newly supplied info.
function _linkIdentity(userId, key, socialUserInfo, creds) {
    var identityOptions = {
            id: socialUserInfo.id,
            accessToken: creds.access_token,
            screen_name: socialUserInfo.username
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
            type: 'pinterest'
        };

    return db.tokens.insert(newTokenObj).then(function() { return token; });
}
