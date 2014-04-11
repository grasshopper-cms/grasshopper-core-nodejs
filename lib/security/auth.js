/**
 * User authentication model will authenticate the username and password in your database. If they are matching
 * then an auth token is created and returned. This token should be used for the remainer of your requests.
 * @param username
 * @param password
 */
module.exports = function(providerType, options){
    'use strict';

    var provider = require('./providers/' + providerType);

    return provider.auth(options);
};