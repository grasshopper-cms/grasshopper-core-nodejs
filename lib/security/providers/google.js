var db = require('../../db'),
    q = require('q'),
    Strings = require('../../strings'),
    crypto = require('../../utils/crypto'),
    uuid  = require('node-uuid'),
    strings = new Strings('en'),
    err = new Error(strings.group('errors').invalid_login),
    googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '368397874840-7fs2rn3vo8bfjus34r1oaisj4hfftru4.apps.googleusercontent.com',
    secret = 'z5ztaNxOIVGNj7yYOVBSSxeH',
    redirect = 'http://localhost:3000/oauth2callback',
    oAuthClient = new OAuth2Client(client, secret, redirect),
    scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ];

err.code = strings.group('codes').unauthorized;

module.exports = {
    auth: function(options){
        'use strict';
        var deferred = q.defer();

        _getTokenFromAuthCode(options.code)
            .done(function(googleCredentials) {

                db.users.googleAuthentication(googleCredentials.id_token.payload.id)
                    .then(function(user) {
                        var t = uuid.v4();

                        // See if I can still get a token.
                        db.tokens.insert({
                            _id : t,
                            uid : user._id,
                            created: new Date().toISOString()
                        })
                        .then(function() {
                            deferred.resolve(t);
                        });
                    })
                    .fail(function() {
                        // Make a user with that email and id etc.
                        deferred.reject(err);
                    })
                    .done();
            });

        return deferred.promise;
    }
};

function getUrl() {
    return oAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
    });
}

console.log(getUrl());

function _getTokenFromAuthCode(authCode) {
    var deferred = q.defer();

    oAuthClient.getToken(authCode, function(err, token) {
        if (err) { deferred.reject(err); }


        token.id_token = crypto.decodeJwt(token.id_token);

        return deferred.resolve(token);
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
