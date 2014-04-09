module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        roles = require('../security/roles');

    coordinator.use('nodes.getChildren', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.getChildren,
        middleware.event('out')
    ]);

    coordinator.use('nodes.getById', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.getById,
        middleware.event('out')
    ]);

    coordinator.use('nodes.insert', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.EDITOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.insert,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('nodes.update', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.EDITOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.update,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('nodes.deleteById', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.EDITOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.deleteById,
        middleware.event('out'),
        middleware.event('delete')
    ]);

    coordinator.use('nodes.saveContentTypes',[
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.EDITOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.saveContentTypes,
        middleware.event('out')
    ]);

    return function users(kontx){
        return {
            insert: function(node){
                return coordinator.handle('nodes.insert', node, kontx);
            },
            deleteById: function(id){
                return coordinator.handle('nodes.deleteById', {id: id}, kontx);
            },
            getById: function(id){
                return coordinator.handle('nodes.getById', { id: id }, kontx);
            },
            getChildren: function(id, deep){
                return coordinator.handle('nodes.getChildren', {id: id, deep: deep}, kontx);
            },
            saveContentTypes: function(id, types){
                return coordinator.handle('nodes.saveContentTypes', {id: id, types: types}, kontx);
            },
            update: function(node){
                return coordinator.handle('nodes.update', node, kontx);
            }
        };
    };
})();