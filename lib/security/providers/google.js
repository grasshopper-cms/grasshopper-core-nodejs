var db = require('../../db'),
    q = require('q'),
    Strings = require('../../strings'),
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
                console.log(googleCredentials.access_token);
                deferred.resolve(googleCredentials.access_token);
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
    var deferred = new Q.defer();

    oAuthClient.getToken(authCode, function(err, token) {
        if (err) { deferred.reject(err); }


        token.id_token = decodeJwt(token.id_token);

        return deferred.resolve(token);
    });

    return deferred.promise;
}

// Got this from: http://stackoverflow.com/questions/20159782/how-can-i-decode-a-google-oauth-2-0-jwt-openid-connect-in-a-node-app
function decodeJwt(token) {
    var segments = token.split('.'),
        headerSeg, payloadSeg, signatureSeg,
        header, payload;

    if (segments.length !== 3) {
        throw new Error('Not enough or too many segments');
    }

    // All segment should be base64
    headerSeg = segments[0];
    payloadSeg = segments[1];
    signatureSeg = segments[2];

    // base64 decode and parse JSON
    header = JSON.parse(base64urlDecode(headerSeg));
    payload = JSON.parse(base64urlDecode(payloadSeg));

    return {
        header: header,
        payload: payload,
        signature: signatureSeg
    };

}

function base64urlDecode(str) {
    return new Buffer(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str) {
    str += Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
}

