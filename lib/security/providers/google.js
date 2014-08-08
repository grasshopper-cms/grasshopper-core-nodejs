var q = require('q'),
    db = require('../../db'),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    googleapis = require('googleapis'),
    err, OAuth2Client, appId, secret, redirect, strings, oAuthClient;

strings = new Strings('en');
appId = config.identities.google.appId;
OAuth2Client = googleapis.OAuth2Client;
secret = config.identities.google.secret;
redirect = config.identities.google.oauthCallback;
oAuthClient = new OAuth2Client(appId, secret, redirect);

module.exports = {
    auth: function (options) {
        'use strict';
        var deferred = q.defer();

        _getGoogleTokenFromAuthCode(options.code)
            .then(function (googleCredentials) {

                _getUserDetails(googleCredentials.access_token)
                    .then(function (userInfo) {

                        db.users.googleAuthentication(userInfo.id)
                            .then(function (user) {

                                //see if I can refresh the old token.
                                _createNewToken(user._id)
                                    .then(function (token) {
                                        deferred.resolve(token);
                                    })
                                    .done();
                            })
                            .fail(function () {
                                //does email exist?
                                _userExists(userInfo.email)
                                    .then(function(user){

                                        _linkIdentity(user._id, 'google', userInfo)
                                            .then(function(){
                                                _createNewToken(user._id)
                                                    .then(function (token) {
                                                        deferred.resolve(token);
                                                    })
                                                    .done();
                                            });
                                    }, function(){
                                        _createNewGoogleUser(googleCredentials, userInfo)
                                        .then(function (user) {
                                            _createNewToken(user._id)
                                                .then(function (token) {
                                                    deferred.resolve(token);
                                                })
                                                .done();
                                        });
                                    })
                                    .done();
                            })
                            .done();

                    })
                    .done();
            })
            .catch(function () {
                var fatalError = new Error(strings.group('errors').config_invalid_google_redirectUrl_mismatch);
                fatalError.code = strings.group('codes').forbidden;

                deferred.reject(fatalError);
            });

        return deferred.promise;
    }
};

function _userExists (email) {
    'use strict';
    var deferred = q.defer();

    db.users.getByEmail(email)
        .then(
            function (user) {
                deferred.resolve(user);
            },
            function(err) {
                deferred.reject(err);
            }
        );


    return deferred.promise;

}

function _linkIdentity(userId, key, options) {
    'use strict';
    var deferred = q.defer();

    db.users.linkIdentity(userId, key, options)
        .then(
        function (user) {
            deferred.resolve(user);
        },
        function(err) {
            deferred.reject(err);
        }
    );


    return deferred.promise;
}
function _createNewGoogleUser (googleCredentials, userInfo) {
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
        linkedIdentities: ['google'],
        profile: {
            picture: userInfo.picture
        },
        enabled: true,
        email: userInfo.email,
        firstname: userInfo.given_name,
        lastname: userInfo.family_name
    };

    db.users.insert(newUser)
        .then(function (user) {
            deferred.resolve(user);
        })
        .fail(function (err) {
            deferred.reject(err);
        })
        .done();

    return deferred.promise;
}

function _getUserDetails (accessToken) {
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

    request.get(options, function (error, somethingElse, response) {
        if (error) {
            deferred.reject(error);
        }
        deferred.resolve(JSON.parse(response));
    });

    return deferred.promise;
}

function _createNewToken (userId) {
    'use strict';
    var deferred = q.defer(),
        token = uuid.v4(),
        newTokenObj = {
            _id: token,
            uid: userId,
            created: new Date().toISOString(),
            type : 'google'
        };

    db.tokens.insert(newTokenObj)
        .then(function () {
            deferred.resolve(token);
        });

    return deferred.promise;
}

function _getGoogleTokenFromAuthCode (authCode) {
    'use strict';
    var deferred = q.defer();

    oAuthClient.getToken(authCode, function (err, token) {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(token);
    });

    return deferred.promise;
}