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

    coordinator.use('users.getByLogin',[
        middleware.identity, middleware.role(roles.ADMIN), middleware.users.getByLogin
    ]);

    return {
        create: function(user){
            kontx.args.user = user;
            return coordinator.handle('users.create', kontx);
        },
        getByLogin: function(email){
            kontx.args = email;
            return coordinator.handle('users.getByLogin', kontx);
        },
        getByEmail: function(email){
            kontx.args = email;
            return coordinator.handle('users.getByEmail', kontx);
        }
    };
};

module.exports = users;