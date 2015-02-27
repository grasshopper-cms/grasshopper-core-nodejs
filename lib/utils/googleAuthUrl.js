'use strict';

/**
 * Module that returns the google oauth url.
 */

var _ = require('lodash'),
    BB = require('bluebird'),
    config = require('../config'),
    Strings = require('../strings'),
    strings = new Strings('en').group('errors'),
    OAuth2Client = require('googleapis').OAuth2Client;

module.exports = function googleAuthUrl(){
    var oAuthClient, url,
        appId, secret, scopes, redirect;

    return new BB(function(resolve, reject) {
        if(!_.has(config.identities, 'google')) {
            reject(strings.config_missing_google_identities);
        } else if(!_.has(config.identities.google, 'appId')) {
            reject(strings.config_missing_google_appId);
        } else if(!_.has(config.identities.google, 'secret')) {
            reject(strings.config_missing_google_secret);
        } else if(!_.has(config.identities.google, 'redirectUrl')) {
            reject(strings.config_missing_google_redirectUrl);
        } else if(!_.has(config.identities.google, 'scopes') || !_.isArray(config.identities.google.scopes)) {
            reject(strings.config_missing_google_scopes_array);
        } else if(!_.has(config.identities.google, 'oauthCallback')) {
            reject(strings.config_missing_oauth_callback);
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

            resolve(url);
        }
    });
};