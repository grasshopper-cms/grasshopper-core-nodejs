var q = require('q'),
    db = require('../../db'),
    http = require('request'),
    uuid  = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    googleapis = require('googleapis'),
    crypto = require('../../utils/crypto'),
    err, OAuth2Client, appId, secret, redirect, strings, oAuthClient;

    strings = new Strings('en');
    appId = config.identities.google.appId;
    OAuth2Client = googleapis.OAuth2Client;
    secret = config.identities.google.secret;
    redirect = 'http://localhost:3000/oauth2callback';
    oAuthClient = new OAuth2Client(appId, secret, redirect);
    err = new Error(strings.group('errors').invalid_username);

err.code = strings.group('codes').unauthorized;

module.exports = {
    auth: function(options){
        'use strict';
        var deferred = q.defer();

        _getGoogleTokenFromAuthCode(options.code)
            .done(function(googleCredentials) {

                db.users.googleAuthentication(googleCredentials.id_token.payload.id)
                    .then(function(user) {

                        //see if I can refresh the old token.
                        _createNewToken(user._id)
                            .then(function(token) {
                                deferred.resolve(token);
                            })
                            .done();
                    })
                    .fail(function() {
                        _createNewGoogleUser(googleCredentials)
                            .then(function(user) {
                                _createNewToken(user._id)
                                    .then(function(token) {
                                        deferred.resolve(token);
                                    })
                                    .done();
                            });
                    })
                    .done();
            });

        return deferred.promise;
    }
};

function _createNewGoogleUser(googleCredentials) {
    'use strict';
    var deferred = q.defer(),
        newUser;

    _getUserDetails(googleCredentials.access_token)
        .then(function(userInfo) {
            newUser = {
                role: 'external',
                identities: {
                    google: {
                        id: userInfo.id,
                        accessToken : googleCredentials.access_token,
                        refreshToken : googleCredentials.refresh_token
                    }
                },
                linkedIdentities : ['google'],
                profile: {
                    picture : userInfo.picture
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
        })
        .fail(deferred.reject)
        .done();

    return deferred.promise;
}

function _getUserDetails(accessToken) {
    'use strict';
    var deferred = q.defer(),
        options;

    options = {
        url : config.identities.google.tokenEndpoint + accessToken,
        followAllRedirects : true
    };

    http.get(options, function(error, somethingElse, response) {
        if(error) { deferred.reject(error); }
        deferred.resolve(JSON.parse(response));
    });

    return deferred.promise;
}

function _createNewToken(userId) {
    'use strict';
    var deferred = q.defer(),
        token = uuid.v4(),
        newTokenObj = {
            _id : token,
            uid : userId,
            created: new Date().toISOString()
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
        if (err) { deferred.reject(err); }

        token.id_token = crypto.decodeJwt(token.id_token);

        deferred.resolve(token);
    });

    return deferred.promise;
}