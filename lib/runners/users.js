var users = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        _ = require('underscore'),
        Strings = require('../strings'),
        strings = new Strings('en');

    function roleOrSelf(role){
        if(!_.isNumber(role)){
            role = roles[role.toUpperCase()];
        }

        return function validateRole(kontx, next){
            var userPrivLevel = roles[kontx.user.role.toUpperCase()],
                err = new Error(strings.group('errors').user_privileges_exceeded);
            err.errorCode = strings.group('codes').forbidden;

            //If user has enough priviliges then keep going
            if (userPrivLevel <= parseInt(role, 10) || kontx.user._id === kontx.args[0]){
                next();
                return;
            }

            next(err);
        };
    }

    coordinator.batch(
        middleware.users,
        ['create','deleteById','getByEmail','create','getByLogin','query','deletePermissions','savePermissions'],
        [middleware.identity, middleware.role(roles.ADMIN)]
    );

    coordinator.batch(
        middleware.users,
        ['getById', 'update'],
        [middleware.identity, roleOrSelf(roles.ADMIN)]
    );

    coordinator.use('users.authenticate', []);

    return {
        create: function(user){
            return coordinator.handle('users.create', [user], kontx);
        },
        getByLogin: function(login){
            return coordinator.handle('users.getByLogin', [login], kontx);
        },
        getById: function(id){
            return coordinator.handle('users.getById', [id], kontx);
        },
        deleteById: function(id){
            return coordinator.handle('users.deleteById', [id], kontx);
        },
        getByEmail: function(email){
            return coordinator.handle('users.getByEmail', [email], kontx);
        },
        authenticate: function(login, password){
            return coordinator.handle('users.authenticate', [login, password], kontx);
        },
        savePermissions: function(userId, permissions){
            kontx.args = [userId, permissions.nodeid, permissions.role];
            return coordinator.handle('users.savePermissions', [userId, permissions], kontx);
        },
        deletePermissions: function(userId, nodeId){
            return coordinator.handle('users.deletePermissions', [userId, nodeId], kontx);
        },
        query: function(filters, options){
            return coordinator.handle('users.query', [filters, options], kontx);
        },
        update: function(user){
            return coordinator.handle('users.update', [user], kontx);
        },
        enable: function(userId){
            return coordinator.handle('users.enable', [userId], kontx);
        },
        disable: function(userId){
            return coordinator.handle('users.disable', [userId], kontx);
        },
        list: function(userId){
            return coordinator.handle('users.list', [userId], kontx);
        }
    };
};

module.exports = users;