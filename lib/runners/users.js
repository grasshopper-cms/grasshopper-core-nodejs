var users = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles');

    coordinator.use('users.getByEmail',[
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.users.getByEmail
    ]);

    return {
        getByEmail: function(email){
            kontx.email = email;
            return coordinator.handle('users.getByEmail', kontx);
        }
    };
};

module.exports = users;