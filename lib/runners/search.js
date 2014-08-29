module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        Kontx = require('../utils/kontx'),
        roles = require('../security/roles');

    coordinator.use('search.query', [
        middleware.identity,
        middleware.role(roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.query('nodes'),
        middleware.event('out')
    ]);



    return function search(token){
        return {
            query: function(criteria){
                return coordinator.handle('search.query', criteria, Kontx(token));
            }
        };
    };
})();