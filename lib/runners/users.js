var users = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles');

    coordinator.batch(
        middleware.users,
        ['create','deleteById','getByEmail','create','getByLogin','query','deletePermissions','savePermissions'],
        [middleware.identity, middleware.role(roles.ADMIN)]
    );

    coordinator.batch(
        middleware.users,
        ['getById', 'update'],
        [middleware.identity, middleware.roleOrSelf(roles.ADMIN)]
    );

    coordinator.use('users.authenticate', []);

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
        },
        update: function(user){
            return coordinator.handle('users.update', arguments, kontx);
        },
        enable: function(userId){
            return coordinator.handle('users.enable', arguments, kontx);
        },
        disable: function(userId){
            return coordinator.handle('users.disable', arguments, kontx);
        },
        list: function(userId){
            return coordinator.handle('users.list', arguments, kontx);
        }
    };
};

module.exports = users;