'use strict';

var BB = require('bluebird'),
    db = require('../../db'),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    googleapis = require('googleapis'),
    err, OAuth2Client, appId, secret, redirect, strings, oAuthClient;

strings = new Strings('en');
appId = config.identities.google.appId;
OAuth2Client = BB.promisifyAll(googleapis.OAuth2Client);
secret = config.identities.google.secret;
redirect = config.identities.google.oauthCallback;
oAuthClient = new OAuth2Client(appId, secret, redirect);

module.exports = {
    auth: function(options) {
        return new BB(function(resolve, reject) {
            _getGoogleTokenFromAuthCode(options.code)
                .then(function(googleCredentials) {
                    _getUserDetailsFromGoogle(googleCredentials.access_token)
                        .then(function(userInfo) {
                            db.users.googleAuthentication(userInfo.id)
                                .then(function(user) {
                                    _linkIdentityCall(user._id, userInfo, googleCredentials, resolve, reject);
                                })
                                .fail(function() {
                                    _linkIfUserExists(userInfo, googleCredentials, resolve, reject);
                                });
                        });
                })
                .catch(function() {
                    var fatalError = new Error(strings.group('errors').config_invalid_google_redirectUrl_mismatch);
                    fatalError.code = strings.group('codes').forbidden;

                    reject(fatalError);
                });
        });
    }
};

function _throwFatal(err, deferred) {
    var fatalError = new Error(err);
    fatalError.code = strings.group('codes').forbidden;

    deferred.reject(fatalError);
}

function _linkIfUserExists(userInfo, googleCredentials, resolve, reject) {

    _userExists(userInfo.email)
        .then(function(user) {
            _linkIdentityCall(user._id, userInfo, googleCredentials, resolve, reject);
        })
        .fail(function() {
            _createNewGoogleUser(googleCredentials, userInfo)
                .then(function(user) {
                    _createNewToken(user._id)
                        .then(function(token) {
                            resolve(token);
                        }, function(err){
                            _throwFatal.call(this, err, resolve, reject);
                        });
                }, function(err){
                    _throwFatal.call(this, err, resolve, reject);
                });
        });
}

function _linkIdentityCall(id, userInfo, googleCredentials, resolve, reject) {

    _linkIdentity(id, 'google', userInfo, googleCredentials)
        .then(function() {
            _createNewToken(id)
                .then(function(token) {
                    resolve(token);
                }, function(err){
                    _throwFatal.call(this, err, resolve, reject);
                });
        }, function(err){
            _throwFatal.call(this, err, resolve, reject);
        });
}

function _userExists(email) {
    return db.users.getByEmail(email);
}

function _linkIdentity(userId, key, options, googleCredentials) {
    var identityOptions = {
            id: options.id,
            accessToken: googleCredentials.access_token,
            refreshToken: googleCredentials.refresh_token
        };

    return db.users.linkIdentity(userId, key, identityOptions);
}

function _createNewGoogleUser(googleCredentials, userInfo) {
    var newUser;

    newUser = {
        role: 'external',
        identities: {
            google: {
                id: userInfo.id,
                accessToken: googleCredentials.access_token,
                refreshToken: googleCredentials.refresh_token
            }
        },
        linkedidentities: ['google'],
        profile: {
            picture: userInfo.picture
        },
        enabled: true,
        email: userInfo.email,
        firstname: userInfo.given_name,
        lastname: userInfo.family_name
    };

    return db.users.insert(newUser);
}

function _getUserDetailsFromGoogle(accessToken) {
    return new BB(function(resolve, reject) {
        var options;

        options = {
            url: config.identities.google.tokenEndpoint,
            followAllRedirects: true,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };

        request.get(options, function(error, somethingElse, response) {
            if (error) {
                reject(error);
            }
            resolve(JSON.parse(response));
        });
    });
}

function _createNewToken(userId) {
    var token = uuid.v4(),
        newTokenObj = {
            _id: token,
            uid: userId,
            created: new Date().toISOString(),
            type: 'google'
        };

    return db.tokens.insert(newTokenObj);
}

function _getGoogleTokenFromAuthCode(authCode) {
    return oAuthClient.getTokenAsync(authCode);
}