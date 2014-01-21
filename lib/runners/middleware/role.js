module.exports = function(role){
    'use strict';

    var _ = require('underscore'),
        roles = require('../../security/roles'),
        Strings = require('../../strings'),
        strings = new Strings('en');

    if(!_.isNumber(role)){
        role = roles[role.toUpperCase()];
    }

    return function validateRole(kontx, next){
        var userPrivLevel = roles[kontx.user.role.toUpperCase()];

        if (userPrivLevel <= parseInt(role, 10)){
            next();
            return;
        }

        next(new Error(strings.group('errors').user_privileges_exceeded));
    };
};