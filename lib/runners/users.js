var users = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles');

    coordinator.batch(
        middleware.users,
        ['getById','getByEmail','create','getByLogin'],
        [middleware.identity, middleware.role(roles.ADMIN)]
    );

    return {
        create: function(user){
            return coordinator.handle('users.create', arguments, kontx);
        },
        getByLogin: function(login){
            return coordinator.handle('users.getByLogin', arguments, kontx);
        },
        getById: function(id){
            return coordinator.handle('users.getById', arguments, kontx);
        },
        deleteById: function(id){
            return coordinator.handle('users.deleteById', arguments, kontx);
        },
        getByEmail: function(email){
            return coordinator.handle('users.getByEmail', arguments, kontx);
        },
        authenticate: function(login, password){
            return coordinator.handle('users.authenticate', arguments, kontx);
        },
        savePermissions: function(userId, permissions){
            kontx.args = [userId, permissions.nodeid, permissions.role];
            return coordinator.handle('users.savePermissions', arguments, kontx);
        },
        deletePermissions: function(userId, nodeId){
            return coordinator.handle('users.deletePermissions', arguments, kontx);
        },
        query: function(filters, options){
            return coordinator.handle('users.query', arguments, kontx);
        }
    };
};

module.exports = users;