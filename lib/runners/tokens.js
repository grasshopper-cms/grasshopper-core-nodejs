/**
 * Tokens are used to send back a generic key that indicates that you have been logged in in the past. Having a valid
 * token means that once you log in, through the application you will not have to do it again unless the tokens have
 * been revoked or expired. This is handy when you have to do many operations at once. You would just log in, get a token
 * and send the token around to ensure that you have access to the system.
 * @type {tokens}
 */
module.exports = function tokens(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles');

    coordinator.use('tokens.create', [middleware.auth, middleware.tokens.create]);
    coordinator.use('tokens.getNew', [middleware.identity, middleware.tokens.getNew]);

    coordinator.batch(
        middleware.tokens,
        ['getById', 'validate', 'deleteById', 'getNew'],
        []
    );

    return {
        getById: function(id){
            return coordinator.handle('tokens.getById', arguments, kontx);
        },
        deleteById: function(id){
            return coordinator.handle('tokens.deleteById', arguments, kontx);
        },
        create: function(username, password){
            return coordinator.handle('tokens.create', arguments, kontx);
        },
        getNew: function(){
            return coordinator.handle('tokens.getNew', arguments, kontx);
        },
        validate: function(token){
            return coordinator.handle('tokens.validate', arguments, kontx);
        }
    };
};