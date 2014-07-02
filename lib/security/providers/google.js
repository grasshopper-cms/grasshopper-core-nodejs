var db = require('../../db'),
    q = require('q'),
    Strings = require('../../strings'),
    crypto = require('../../utils/crypto'),
    uuid  = require('node-uuid'),
    http = require('request'),
    config = require('../../config'),
    strings = new Strings('en'),
    err = new Error(strings.group('errors').invalid_login),
    googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    appId = config.identities.google.appId,
    secret = config.identities.google.secret,
    redirect = 'http://localhost:3000/oauth2callback',
    oAuthClient = new OAuth2Client(appId, secret, redirect),
    scopes = config.identities.google.scopes;

err.code = strings.group('codes').unauthorized;

module.exports = {
    auth: function(options){
        'use strict';
        var deferred = q.defer();

        _getTokenFromAuthCode(options.code)
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
        url : 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+ accessToken,
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
        t = uuid.v4(),
        newToken = {
            _id : t,
            uid : userId,
            created: new Date().toISOString()
        };

    db.tokens.insert(newToken)
        .then(function() {
            deferred.resolve(t);
        });

    return deferred.promise;
}

function getUrl() {
    'use strict';
    return oAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
    });
}

console.log(getUrl());

function _getTokenFromAuthCode(authCode) {
    'use strict';
    var deferred = q.defer();

    oAuthClient.getToken(authCode, function(err, token) {
        if (err) { deferred.reject(err); }

        token.id_token = crypto.decodeJwt(token.id_token);

        deferred.resolve(token);
    });

    return deferred.promise;
}

/*
 {
 access_token: 'ya29.NACyvZjscSo6RRwAAADcKQ_6H2yc7puZZaf49R6uxvX8R2XMoX9cEL1VEZG0GQ',
 token_type: 'Bearer',
 expires_in: 3600,
 id_token: {
 header: {
 alg: 'RS256',
 kid: '1ec734ab76fc7d0578e5b3092965a8267e2ae7ec'
 },
 payload: {
 iss: 'accounts.google.com',
 id: '105708433433841019982',
 sub: '105708433433841019982',
 azp: '368397874840-7fs2rn3vo8bfjus34r1oaisj4hfftru4.apps.googleusercontent.com',
 email: 'greg.larrenaga@thinksolid.com',
 at_hash: 'zXJOepd-Zl0HqwWywwlpQw',
 email_verified: true,
 aud: '368397874840-7fs2rn3vo8bfjus34r1oaisj4hfftru4.apps.googleusercontent.com',
 hd: 'thinksolid.com',
 token_hash: 'zXJOepd-Zl0HqwWywwlpQw',
 verified_email: true,
 cid: '368397874840-7fs2rn3vo8bfjus34r1oaisj4hfftru4.apps.googleusercontent.com',
 iat: 1404166511,
 exp: 1404170411
 },
 signature: 'NFRNi5kMWivc3lniTGR9Qxsw95GAZzLnZahCuIX8rJHUnKm_EAz50yfq5PFWG8aIyHOrpMg9rvp_7sHyT3cEwzodI60pr77VTCSd0SuEUdWZ-UmGsABM3aj7n_mh8IQFU427RxCUOm000KH2BA9CY_ZhGt-mrT5FC59v2p8Rl5c'
 },
 refresh_token: '1/NTZigTEFeeozMqJtFianNRUv6Qj-HRzdUa3PVt1pu3w'
 }
 */