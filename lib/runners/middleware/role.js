module.exports = function(role){
    'use strict';

    var _ = require('underscore'),
        roles = require('../../security/roles');

    if(!_.isNumber(role)){
        role = roles[role.toUpperCase()];
    }

    return function(kontx, next){
        kontx.role = role;
        next();
    };
};