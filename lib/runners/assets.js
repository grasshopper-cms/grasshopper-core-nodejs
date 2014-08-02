module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        Kontx = require('../utils/kontx'),
        roles = require('../security/roles');

    coordinator.use('assets.find', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.find,
        middleware.event('out')
    ]);

    coordinator.use('assets.list', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.list,
        middleware.event('out')
    ]);

    coordinator.use('assets.save', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.EXTERNAL),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.save,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('assets.rename', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.rename,
        middleware.event('out'),
        middleware.event('rename')
    ]);

    coordinator.use('assets.move', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.move,
        middleware.event('out'),
        middleware.event('move')
    ]);

    coordinator.use('assets.copy', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.copy,
        middleware.event('out'),
        middleware.event('copy')
    ]);

    coordinator.use('assets.delete', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.delete,
        middleware.event('out'),
        middleware.event('delete')
    ]);

    coordinator.use('assets.deleteAll', [
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.assets.deleteAll,
        middleware.event('out'),
        middleware.event('delete')
    ]);

    return function users(token){
        return {
            find: function(params){
                return coordinator.handle('assets.find', params, Kontx(token));
            },
            list: function(params){
                return coordinator.handle('assets.list', params, Kontx(token));
            },
            save: function(params){
                return coordinator.handle('assets.save',params, Kontx(token));
            },
            rename: function(params){
                return coordinator.handle('assets.rename', params, Kontx(token));
            },
            move: function(params){
                return coordinator.handle('assets.move', params, Kontx(token));
            },
            copy: function(params){
                return coordinator.handle('assets.copy', params, Kontx(token));
            },
            delete: function(params){
                return coordinator.handle('assets.delete', params, Kontx(token));
            },
            deleteAll: function(params){
                return coordinator.handle('assets.deleteAll', params, Kontx(token));
            }
        };
    };
})();