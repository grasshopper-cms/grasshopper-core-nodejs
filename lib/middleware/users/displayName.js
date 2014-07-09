/**
 * Middleware that sets a default displayName if it is not set.
 *
 * @param kontx
 * @param next
 */

var _ = require('underscore');

module.exports = function create(kontx, next){
    'use strict';

    var user = kontx.args[0],
        identityType;

    // if user does not have a display name, or, the display name is empty
    if(!_.has(user, 'displayName') || _.has(user, 'displayName') && !_.isEmpty(user.displayName)) {
        identityType = _.chain(user.identities).keys().first().value();

        switch(identityType) {
            case 'google':
                user.displayName = user.email;
                break;
            case 'basic':
                user.displayName = user.identities.basic.username;
                break;
            default:
                user.displayName = user.email;
        }
    }

    next();
};