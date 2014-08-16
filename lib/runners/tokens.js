/**
 * Tokens are used to send back a generic key that indicates that you have been logged in in the past. Having a valid
 * token means that once you log in, through the application you will not have to do it again unless the tokens have
 * been revoked or expired. This is handy when you have to do many operations at once. You would just log in, get a token
 * and send the token around to ensure that you have access to the system.
 */
var tokens = function(token) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        _ = require('lodash'),
        Kontx = require('../utils/kontx'),
        Strings = require('../strings'),
        strings = new Strings(),
        createError = require('../utils/error');

    function selfOrRole(role){
        function userHasRights(userPrivLevel){
            if(!_.isNumber(userPrivLevel)){
                userPrivLevel = roles[userPrivLevel.toUpperCase()];
            }
            return (userPrivLevel <= parseInt(role, 10));
        }

        return function selfOrRole(kontx, next){
            var userKontx = _.extend({}, kontx.user),
                userPrivLevel = userKontx.role,
                isValid = userHasRights(userPrivLevel),
                err = createError(strings.group('codes').forbidden, strings.group('errors').user_privileges_exceeded);


            //If user doesn't have rights verify that they are performing operation on their own token.
            if (!isValid){
                isValid = (kontx.args[0] === kontx.token);
            }

            next((isValid) ? null : err);
        };
    }

    coordinator.use('tokens.impersonate', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.tokens.impersonate,
        middleware.event('out')
    ]);

    coordinator.use('tokens.getNew', [
        middleware.identity,
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.tokens.getNew,
        middleware.event('out')
    ]);

    coordinator.use('tokens.deleteById', [
        middleware.identity,
        selfOrRole(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.tokens.deleteById,
        middleware.event('out'),
        middleware.event('delete')
    ]);

    coordinator.use('tokens.logout', [
        middleware.identity,
        middleware.event('parse'),
        middleware.event('validate'),
        function(kontx, next){
            kontx.args[0] = kontx.token;
            next();
        },
        middleware.tokens.deleteById,
        middleware.event('out')
    ]);


    return {
        deleteById: function(id){
            return coordinator.handle('tokens.deleteById', [id], Kontx(token));
        },
        logout: function(){
            return coordinator.handle('tokens.logout', [], Kontx(token));
        },
        getNew: function(type){
            return coordinator.handle('tokens.getNew', [type], Kontx(token));
        },
        impersonate: function(userId){
            return coordinator.handle('tokens.impersonate', [userId], Kontx(token));
        }
    };
};

module.exports = tokens;