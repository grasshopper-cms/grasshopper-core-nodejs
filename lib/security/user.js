/**
 * The user security module simply checks if the current logged in user has enough rights
 * to run a piece of code.
 */
(function(){
    'use strict';

    var permissions = {},
        roles = require('./roles');

    permissions.allowed = function(userRole, minPermissionLevel) {
        var userPrivLevel = roles[userRole.toUpperCase()];

        return (userPrivLevel <= parseInt(minPermissionLevel, 10));
    };

    module.exports = permissions;
})();