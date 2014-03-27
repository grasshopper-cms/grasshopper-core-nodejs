module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        roles = require('../security/roles');

    coordinator.batch(
        middleware.assets,
        ['find', 'list'],[
            middleware.identity,
            middleware.nodes.setNodeIdFromArgument,
            middleware.nodes.requireNodePermissions(security.roles.READER)
        ]
    );

    coordinator.batch(
        middleware.assets,
        ['save', 'rename', 'move', 'copy','delete','deleteAll'],[
            middleware.identity,
            middleware.nodes.setNodeIdFromParentArgument,
            middleware.nodes.requireNodePermissions(security.roles.AUTHOR)
        ]
    );

    return function users(kontx){
        return {
            find: function(params){
                return coordinator.handle('assets.find', params, kontx);
            },
            list: function(params){
                return coordinator.handle('assets.list', params, kontx);
            },
            save: function(params){
                return coordinator.handle('assets.save',params, kontx);
            },
            rename: function(params){
                return coordinator.handle('assets.rename', params, kontx);
            },
            move: function(params){
                return coordinator.handle('assets.move', params, kontx);
            },
            copy: function(params){
                return coordinator.handle('assets.copy', params, kontx);
            },
            delete: function(params){
                return coordinator.handle('assets.delete', params, kontx);
            },
            deleteAll: function(params){
                return coordinator.handle('assets.deleteAll', params, kontx);
            }
        };
    };
})();