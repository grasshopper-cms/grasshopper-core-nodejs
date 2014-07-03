/**
 * Middleware that creates a linkedIdentities array on the user, this array contains a string representing each identity the user has.
 *
 * @param kontx
 * @param next
 */
module.exports = function createLinkedIdentities(kontx, next){
    'use strict';

    var _ = require('underscore'),
        user = kontx.args[0];

    user.linkedIdentities = [];

    _.each(user.identities, function(value, key) {
        user.linkedIdentities.push(key);
    });

    kontx.args[0] = user;

    next();
};