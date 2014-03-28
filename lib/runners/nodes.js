module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        roles = require('../security/roles'),
        _ = require('underscore');

    function setParentOfNode(kontx, next){

    }

    coordinator.batch(
        middleware.nodes,
        ['getById', 'getChildren'],[
            middleware.identity,
            middleware.nodes.setNodeIdFromArgument,
            middleware.nodes.requireNodePermissions(security.roles.READER)
        ]
    );

    coordinator.batch(
        middleware.nodes,
        ['insert', 'update', 'deleteById'],[
            middleware.identity,
            middleware.nodes.setNodeIdFromParentArgument,
            middleware.nodes.requireNodePermissions(security.roles.EDITOR)
        ]
    );

    coordinator.use('nodes.saveContentTypes',[
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.EDITOR),
        middleware.nodes.saveContentTypes
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