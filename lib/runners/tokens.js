/**
 * Tokens are used to send back a generic key that indicates that you have been logged in in the past. Having a valid
 * token means that once you log in, through the application you will not have to do it again unless the tokens have
 * been revoked or expired. This is handy when you have to do many operations at once. You would just log in, get a token
 * and send the token around to ensure that you have access to the system.
 */
var tokens = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        _ = require('underscore'),
        Strings = require('../strings'),
        strings = new Strings('en');

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
                err = new Error(strings.group('errors').user_privileges_exceeded);

            err.errorCode = strings.group('codes').forbidden;

            //If user doesn't have rights verify that they are performing operation on their own token.
            if (!isValid){
                isValid = (kontx.args[0] === kontx.token);
            }

            next((isValid) ? null : err);
        };
    }

    coordinator.use('tokens.impersonate',
        [middleware.identity, middleware.role(roles.ADMIN), middleware.tokens.impersonate]
    );

    coordinator.use('tokens.getNew',
        [middleware.identity, middleware.tokens.getNew]
    );

    coordinator.use('tokens.deleteById',
        [middleware.identity, selfOrRole(roles.ADMIN), middleware.tokens.deleteById]
    );


    return {
        deleteById: function(id){
            return coordinator.handle('tokens.deleteById', [id], kontx);
        },
        getNew: function(){
            return coordinator.handle('tokens.getNew', [], kontx);
        },
        impersonate: function(userId){
            return coordinator.handle('tokens.impersonate', [userId], kontx);
        }
    };
};

module.exports = tokens;