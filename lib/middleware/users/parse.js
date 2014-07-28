/**
 * Middleware that performs custom parsing of the user object to move things around if necessary. Example: Basic Auth
 *
 * @param kontx
 * @param next
 */
module.exports = function parse(kontx, next){
    'use strict';

    var _ = require('lodash'),
        crypto = require('../../utils/crypto'),
        user = kontx.args[0];

    // Application has set a password
    if (_.has(user, 'identities') && !_.isUndefined( user.identities.basic ) && !_.isNull( user.identities.basic ) ) {

        if ( !_.isUndefined( user.identities.basic.password ) &&
            !_.isNull( user.identities.basic.password ) &&
            user.identities.basic.password.length >= 6 ) {

            user.identities.basic.salt = crypto.createSalt();
            user.identities.basic.hash = crypto.createHash(user.identities.basic.password, user.identities.basic.salt);
            delete user.identities.basic.password;
            kontx.args[0] = user;
        }

    }

    next();
};