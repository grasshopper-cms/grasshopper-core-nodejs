(function(){
    "use strict";

    var permissions = {},
        privileges = require('./privileges');

    permissions.allowed = function(userRole, minPermissionLevel) {
        var userPrivLevel = privileges.available[userRole.toUpperCase()];

        return (userPrivLevel <= parseInt(minPermissionLevel, 10));
    };

    module.exports = permissions;
})();