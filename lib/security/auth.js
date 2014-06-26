/**
 * The user authentication module will accept a providerType (username, google, facebook, etc) and the
 * options for the providerType. It will then load the appropriate module and try and authenticate the
 * user.
 *
 * @param providerType (username, google, facebook, etc)
 * @param options Credentials needed to authenticate.
 * @returns {*}
 */
module.exports = function(providerType, options){
    'use strict';

    var provider;

    switch( providerType.toLowerCase() ) {
        case 'google':
            provider = require('./providers/google');
            break;
        default:
            console.log('Then EHre');
            provider = require('./providers/basic');
            break;
    }

    return provider.auth(options);
};