'use strict';

/**
 * Module that returns the google oauth url.
 */

var q = require('q'),
    _ = require('lodash'),
    config = require('../config'),
    Strings = require('../strings'),
    strings = new Strings('en').group('errors'),
    //OAuth2Client = require('googleapis').OAuth2Client;
    OAuth2Client = require('googleapis').auth.OAuth2;

module.exports = function googleAuthUrl(){
    var deferred = q.defer(),
        oAuthClient, url,
        appId, secret, scopes, redirect;

    if(!_.has(config.identities, 'google')) {
        deferred.reject(strings.config_missing_google_identities);
    } else if(!_.has(config.identities.google, 'appId')) {
        deferred.reject(strings.config_missing_google_appId);
    } else if(!_.has(config.identities.google, 'secret')) {
        deferred.reject(strings.config_missing_google_secret);
    } else if(!_.has(config.identities.google, 'redirectUrl')) {
        deferred.reject(strings.config_missing_google_redirectUrl);
    } else if(!_.has(config.identities.google, 'scopes') || !_.isArray(config.identities.google.scopes)) {
        deferred.reject(strings.config_missing_google_scopes_array);
    } else if(!_.has(config.identities.google, 'oauthCallback')) {
        deferred.reject(strings.config_missing_oauth_callback);
    } else {
        appId = config.identities.google.appId;
        secret = config.identities.google.secret;
        scopes = config.identities.google.scopes;
        redirect = config.identities.google.oauthCallback;

        oAuthClient = new OAuth2Client(appId, secret, redirect);

        url = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(' ')
        });

        deferred.resolve(url);
    }

    return deferred.promise;
};
