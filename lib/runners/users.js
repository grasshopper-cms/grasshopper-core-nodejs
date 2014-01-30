module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        createError = require('../utils/error'),
        _ = require('underscore'),
        Strings = require('../strings'),
        strings = new Strings();

    /**
     * Middleware the ensures that the user either has a good enough role or is trying to get information
     * about themselves.
     * @param role
     * @returns {Function}
     */
    function roleOrSelf(role){
        if(!_.isNumber(role)){
            role = roles[role.toUpperCase()];
        }

        return function validateRoleOrSelf(kontx, next){
            var userPrivLevel = roles[kontx.user.role.toUpperCase()],
                passedInUserId = kontx.args[0],
                err = createError(strings.group('codes').forbidden, strings.group('errors').user_privileges_exceeded);

            //If user object passed in instead of a string then parse.
            if(!_.isUndefined(kontx.args[0]._id)){
                passedInUserId = kontx.args[0]._id;
            }

            //If user has enough priviliges then keep going
            if (userPrivLevel <= parseInt(role, 10) || kontx.user._id.toString() === passedInUserId.toString()){
                next();
                return;
            }

            next(err);
        };
    }

    /**
     * Middleware that will set the function argument equal to the currently logged in user id if it is left
     * empty. This can be used for returning back the currently logged in user's information.
     * @param kontx
     * @param next
     */
    function setDefaultUser(kontx, next){
        if(kontx.args.length === 0){
            kontx.args[0] = kontx.user._id;
        }
        next();
    }

    coordinator.batch(
        middleware.users,
        ['create','deleteById','getByEmail','create','getByLogin','query','deletePermissions','savePermissions', 'list'],
        [middleware.identity, middleware.role(roles.ADMIN)]
    );

    coordinator.batch(
        middleware.users,
        ['getById', 'update'],
        [middleware.identity, setDefaultUser, roleOrSelf(roles.ADMIN)]
    );

    coordinator.use('users.authenticate', []);

    return function users(kontx){
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
            current: function(){
                return coordinator.handle('users.getById', [], kontx);
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
            query: function(criteria){
                var filters = {},
                    options = {};
                if(!_.isUndefined(criteria)){
                    filters = criteria.filters;
                    options = criteria.options;
                }
                kontx.args = [filters, options];
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
            list: function(options){
                return coordinator.handle('users.list', [options], kontx);
            }
        };
    };
})();