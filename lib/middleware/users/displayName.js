/**
 * Middleware that sets the default displayName if it is not set.
 *
 * @param kontx
 * @param next
 */

var _ = require('underscore');

module.exports = function create(kontx, next){
    'use strict';

    console.log('YOUROUYROUYROUYROUYROUYROUYROUYROUYROUYROUYR');

    var user = kontx.args[0];

    console.log(kontx);

//    user.linkedIdentities = [];

//    _.each(user.identities, function(value, key) {
//        user.linkedIdentities.push(key);
//    });

//    kontx.args[0] = user;

    next();
};