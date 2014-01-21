/**
 * This middleware will validate if a user has a high enough user role to perform a task. The passed in role is
 * the required role and the required role is compaired to the user's role that is in the kontx.
 * @param role
 * @returns {Function}
 */
module.exports = function(role){
    'use strict';

    var _ = require('underscore'),
        roles = require('../security/roles'),
        Strings = require('../strings'),
        strings = new Strings('en');

    if(!_.isNumber(role)){
        role = roles[role.toUpperCase()];
    }

    return function validateRole(kontx, next){
        var userPrivLevel = roles[kontx.user.role.toUpperCase()],
            err = new Error(strings.group('errors').user_privileges_exceeded);

        err.errorCode = strings.group('codes').forbidden;

        //If user has enough priviliges then keep going
        if (userPrivLevel <= parseInt(role, 10)){
            next();
            return;
        }

        next(err);
    };
};