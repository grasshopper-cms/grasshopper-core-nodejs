var users = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles');

    coordinator.use('users.create',[
        middleware.identity, middleware.role(roles.ADMIN), middleware.users.create
    ]);

    coordinator.use('users.getByEmail',[
        middleware.identity, middleware.role(roles.ADMIN), middleware.users.getByEmail
    ]);

    return {
        create: function(user){
            kontx.args.user = user;
            return coordinator.handle('users.create', kontx);
        },
        getByEmail: function(email){
            kontx.args.email = email;
            return coordinator.handle('users.getByEmail', kontx);
        }
    };
};

module.exports = users;