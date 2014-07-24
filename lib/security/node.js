/**
 * Node security is a module that is used to compare a users permissions that they have for a node and matches
 * whether or not it is sufficient to access the resources of that node.
 */
(function(){
    'use strict';

    var permissions = {},
        _ = require('lodash'),
        roles = require('./roles'),
        user = require('./user');

    function allowed(nodeid, userPermissions, minPermissionLevel) {
        var isAllowed = _.find(userPermissions, function(permission){
            var userPrivLevel = roles[permission.role.toUpperCase()];

            return (permission.nodeid.toString() === nodeid.toString() &&  (userPrivLevel <= parseInt(minPermissionLevel, 10)));
        });

        return (!_.isUndefined(isAllowed));
    }

    function denied(nodeid, userPermissions, minPermissionLevel){
        var restriction = _.find(userPermissions, function(permission){
            var userPrivLevel = parseInt(roles[permission.role.toUpperCase()], 10);

            return (permission.nodeid.toString() === nodeid &&  (userPrivLevel >= parseInt(minPermissionLevel, 10)));
        });

        return (!_.isUndefined(restriction));
    }

    permissions.allowed = function(nodeid, userRole, userPermissions, minPermissionLevel){
        return (
            (user.allowed(userRole, minPermissionLevel) && !denied(nodeid, userPermissions, minPermissionLevel)) ||
                allowed(nodeid, userPermissions, minPermissionLevel)
            );
    };

    module.exports = permissions;
})();
