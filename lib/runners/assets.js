module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
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