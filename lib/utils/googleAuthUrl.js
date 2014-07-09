'use strict';

/**
 * Module that returns the google oauth url.
 */

var q = require('q'),
    _ = require('lodash'),
    config = require('../config'),
    googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    redirect = 'http://localhost:3000/oauth2callback';

module.exports = function googleAuthUrl(){
    var deferred = q.defer(),
        oAuthClient, url,
        appId, secret, scopes;

    if(!_.has(config.identities, 'google')) {
        deferred.reject('Cannot Generate URL: Your ghapi config does not have a identities.google object.');
    } else if(!_.has(config.identities.google, 'appId')) {
        deferred.reject('Cannot Generate URL: You need a google app id on your ghapi config.');
    } else if(!_.has(config.identities.google, 'secret')) {
        deferred.reject('Cannot Generate URL: You need a google secret on your ghapi config.');
    } else if(!_.has(config.identities.google, 'redirectUrl')) {
        deferred.reject('Cannot Generate URL: You need a google redirectUrl on your ghapi config.');
    } else if(!_.has(config.identities.google, 'scopes') || !_.isArray(config.identities.google.scopes)) {
        deferred.reject('Cannot Generate URL: You need a google scopes array on your ghapi config.');
    } else {
        appId = config.identities.google.appId;
        secret = config.identities.google.secret;
        scopes = config.identities.google.scopes;

        oAuthClient = new OAuth2Client(appId, secret, redirect);


        url = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(' ')
        });

        deferred.resolve(url);
    }
    
    return deferred.promise;
};
