module.exports = (function() {
    'use strict';
    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        createError = require('../utils/error'),
        Kontx = require('../utils/kontx'),
        _ = require('lodash'),
        Strings = require('../strings'),
        strings = new Strings();

    /**
     * Middleware the ensures that the user either has a good enough role or is trying to get information
     * about themselves.
     * @param role
     * @returns {Function}
     */
    function roleOrSelf (role) {
        if (!_.isNumber(role)) {
            role = roles[role.toUpperCase()];
        }

        return function validateRoleOrSelf (kontx, next) {
            var userPrivLevel = roles[kontx.user.role.toUpperCase()],
                passedInUserId = kontx.args[0],
                err = createError(strings.group('codes').forbidden, strings.group('errors').user_privileges_exceeded);

            //If user object passed in instead of a string then parse.
            if (!_.isUndefined(kontx.args[0]._id)) {
                passedInUserId = kontx.args[0]._id;
            }

            //If user has enough priviliges then keep going
            if (userPrivLevel <= parseInt(role, 10) || kontx.user._id.toString() === passedInUserId.toString()) {
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
    function setDefaultUser (kontx, next) {
        var a = _.clone(kontx.args);

        if (a.length === 0) { //No args are sent in, set first to be user id
            a[0] = kontx.user._id;
        }
        else if (_.has(a[0], 'include') || _.has(a[0], 'exclude')) { // If first arg is options then reassign
            a[0] = kontx.user._id;
            a[1] = kontx.args[0];
        }

        kontx.args = a;
        next();
    }

    coordinator.batch(
        middleware.users,
        ['deletePermissions', 'savePermissions'],
        [middleware.event('parse'), middleware.event('validate'), middleware.identity, middleware.role(roles.ADMIN)]
    );

    coordinator.use('users.list', [
        middleware.identity,
        middleware.role(roles.EDITOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.list,
        middleware.event('out')
    ]);

    coordinator.use('users.query', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.query('users'),
        middleware.event('out')
    ]);

    coordinator.use('users.getByEmail', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.getByEmail,
        middleware.event('out')
    ]);

    coordinator.use('users.deleteById', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.deleteById,
        middleware.event('out'),
        middleware.event('delete')
    ]);

    coordinator.use('users.getById', [
        middleware.identity,
        setDefaultUser,
        roleOrSelf(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.getById,
        middleware.event('out')
    ]);

    coordinator.use('users.getBySlug', [
        middleware.identity,
        setDefaultUser,
        roleOrSelf(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.getBySlug,
        middleware.event('out')
    ]);

    coordinator.use('users.insert', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.users.linkedidentities.create,
        middleware.users.parse,
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.validate,
        middleware.users.insert,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('users.update', [
        middleware.identity,
        setDefaultUser,
        roleOrSelf(roles.ADMIN),
        middleware.users.parse,
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.users.validate,
        middleware.users.update,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('users.getIdentity', [
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.identity,
        middleware.users.getIdentity,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('users.linkIdentity', [
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.identity,
        middleware.users.linkIdentity,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('users.unLinkIdentity', [
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.identity,
        middleware.users.unLinkIdentity,
        middleware.event('out'),
        middleware.event('save')
    ]);
    return function users(token){
        return {
            insert: function(user){
                return coordinator.handle('users.insert', [user], Kontx(token));
            },
            getById: function(id, options){
                return coordinator.handle('users.getById', [id, options], Kontx(token));
            },
            getBySlug: function(id, options){
                return coordinator.handle('users.getBySlug', [id, options], Kontx(token));
            },
            current: function(options){
                var args = [];

                if(options){
                    args.push(options);
                }

                return coordinator.handle('users.getById', args, Kontx(token));
            },
            deleteById: function(id){
                return coordinator.handle('users.deleteById', [id], Kontx(token));
            },
            getByEmail: function(email, options){
                return coordinator.handle('users.getByEmail', [email, options], Kontx(token));
            },
            savePermissions: function(userId, nodeId, role){
                return coordinator.handle('users.savePermissions', [userId, nodeId, role], Kontx(token));
            },
            deletePermissions: function(userId, nodeId){
                return coordinator.handle('users.deletePermissions', [userId, nodeId], Kontx(token));
            },
            query: function(criteria){
                return coordinator.handle('users.query', criteria, Kontx(token));
            },
            update: function(user, options){
                return coordinator.handle('users.update', [user, options], Kontx(token));
            },
            list: function(options){
                return coordinator.handle('users.list', [options], Kontx(token));
            },
            getIdentity: function(userId, key, fields){
                return coordinator.handle('users.getIdentity', [userId, key, fields], Kontx(token));
            },
            linkIdentity: function(userId, key, options){
                return coordinator.handle('users.linkIdentity', [userId, key, options], Kontx(token));
            },
            unLinkIdentity: function(userId, key) {
                return coordinator.handle('users.unLinkIdentity', [userId, key], Kontx(token));
            }
        };
    };
})();
