var q = require('q'),
    db = require('../../db')(),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    googleapis = require('googleapis'),
    crypto = require('../../utils/crypto'),
    err, OAuth2Client, appId, secret, redirect, strings, oAuthClient;

strings = new Strings('en');
appId = config.identities.google.appId;
OAuth2Client = googleapis.auth.OAuth2;
secret = config.identities.google.secret;
redirect = config.identities.google.oauthCallback;
oAuthClient = new OAuth2Client(appId, secret, redirect);

module.exports = {
    auth: function(options) {
        'use strict';
        var deferred = q.defer();

        _getGoogleTokenFromAuthCode(options.code)
            .then(function(googleCredentials) {
                _getUserDetailsFromGoogle(googleCredentials.access_token)
                    .then(function(userInfo) {
                        db.users.socialAuthentication('google', userInfo.id)
                            .then(function(user) {
                                _linkIdentityCall(user._id, userInfo, googleCredentials, deferred);
                            })
                            .fail(function() {
                                _linkIfUserExists(userInfo, googleCredentials, deferred);
                            });
                    });
            })
            .catch(function() {
                var fatalError = new Error(strings.group('errors').config_invalid_google_redirectUrl_mismatch);
                fatalError.code = strings.group('codes').forbidden;

                deferred.reject(fatalError);
            });

        return deferred.promise;
    }
};

function _throwFatal(err, deferred) {
    'use strict';
    var fatalError = new Error(err);
    fatalError.code = strings.group('codes').forbidden;

    deferred.reject(fatalError);
}

function _linkIfUserExists(userInfo, googleCredentials, deferred) {
    'use strict';

    _userExists(userInfo.email)
        .then(function(user) {
            _linkIdentityCall(user._id, userInfo, googleCredentials, deferred);
        })
        .fail(function() {
            _createNewGoogleUser(googleCredentials, userInfo)
                .then(function(user) {
                    _createNewToken(user._id)
                        .then(function(token) {
                            deferred.resolve(token);
                        }, function(err){
                            _throwFatal.call(this, err, deferred);
                        });
                }, function(err){
                    _throwFatal.call(this, err, deferred);
                });
        });
}

function _linkIdentityCall(id, userInfo, googleCredentials, deferred) {
    'use strict';

    _linkIdentity(id, 'google', userInfo, googleCredentials)
        .then(function() {
            _createNewToken(id)
                .then(function(token) {
                    deferred.resolve(token);
                }, function(err){
                    _throwFatal.call(this, err, deferred);
                });
        }, function(err){
            _throwFatal.call(this, err, deferred);
        });
}

function _userExists(email) {
    'use strict';
    var deferred = q.defer();

    db.users.getByEmail(email)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(deferred.reject);

    return deferred.promise;

}

function _linkIdentity(userId, key, options, googleCredentials) {
    'use strict';
    var deferred = q.defer(),
        identityOptions = {
            id: options.id,
            accessToken: googleCredentials.access_token,
            refreshToken: googleCredentials.refresh_token
        };

    db.users.linkIdentity(userId, key, identityOptions)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(deferred.reject)
        .catch(deferred.reject);

    return deferred.promise;
}

function _createNewGoogleUser(googleCredentials, userInfo) {
    'use strict';
    var deferred = q.defer(),
        newUser;

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

    db.users.insert(newUser)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(function(err) {
            deferred.reject(err);
        })
        .done();

    return deferred.promise;
}

function _getUserDetailsFromGoogle(accessToken) {
    'use strict';
    var deferred = q.defer(),
        options;

    options = {
        url: config.identities.google.tokenEndpoint,
        followAllRedirects: true,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    request.get(options, function(error, somethingElse, response) {
        if (error) {
            deferred.reject(error);
        }
        deferred.resolve(JSON.parse(response));
    });

    return deferred.promise;
}

function _createNewToken(userId) {
    'use strict';
    var deferred = q.defer(),
        token = uuid.v4(),
        newTokenObj = {
            _id: crypto.createHash(token, config.crypto.secret_passphrase),
            uid: userId,
            created: new Date().toISOString(),
            type: 'google'
        };

    db.tokens.insert(newTokenObj)
        .then(function() {
            deferred.resolve(token);
        });

    return deferred.promise;
}

function _getGoogleTokenFromAuthCode(authCode) {
    'use strict';
    var deferred = q.defer();

    oAuthClient.getToken(authCode, function(err, token) {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(token);
    });

    return deferred.promise;
}
