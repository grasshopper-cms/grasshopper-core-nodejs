module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        Kontx = require('../utils/kontx'),
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

    coordinator.use('nodes.query', [
        middleware.identity,
        middleware.role(roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.query('nodes'),
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

    coordinator.use('nodes.getBySlug', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.getBySlug,
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

    coordinator.use('nodes.move', [
        middleware.identity,
        middleware.nodes.setNodeIdFromParentArgument,
        middleware.nodes.requireNodePermissions(security.roles.EDITOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.nodes.move,
        middleware.event('out'),
        middleware.event('save')
    ]);

    return function nodes(token){
        return {
            insert: function(node){
                return coordinator.handle('nodes.insert', node, Kontx(token));
            },
            deleteById: function(id){
                return coordinator.handle('nodes.deleteById', {id: id}, Kontx(token));
            },
            getById: function(id){
                return coordinator.handle('nodes.getById', { id: id }, Kontx(token));
            },
            getBySlug: function(id){
                return coordinator.handle('nodes.getBySlug', { id: id }, Kontx(token));
            },
            getChildren: function(id, deep){
                return coordinator.handle('nodes.getChildren', {id: id, deep: deep}, Kontx(token));
            },
            saveContentTypes: function(id, types){
                return coordinator.handle('nodes.saveContentTypes', {id: id, types: types}, Kontx(token));
            },
            update: function(node){
                return coordinator.handle('nodes.update', node, Kontx(token));
            },
            query: function(criteria){
                return coordinator.handle('nodes.query', criteria, Kontx(token));
            },
            move: function(args){
                return coordinator.handle('nodes.move', args, Kontx(token));
            }
        };
    };
})();
