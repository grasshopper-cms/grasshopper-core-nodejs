module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        Kontx = require('../utils/kontx'),
        roles = require('../security/roles');

    coordinator.use('system.shutdown', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('shutdown'),
        middleware.system.shutdown
    ]);

    return function system(token){
        return {
            shutdown: function(){
                return coordinator.handle('system.shutdown', [], Kontx(token));
            }
        };
    };
})();
