module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        roles = require('../security/roles'),
        _ = require('underscore');

    function setParentOfNode(kontx, next){

    }

    coordinator.use('nodes.getById',[
        middleware.identity,
        middleware.nodes.setNodeIdFromArgument,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.nodes.getById
    ]);

    coordinator.batch(
        middleware.nodes,
        ['insert', 'update'],[
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
                return coordinator.handle('nodes.deleteById', [id], kontx);
            },
            getById: function(id){
                return coordinator.handle('nodes.getById',  [id], kontx);
            },
            saveContentTypes: function(id, types){
                return coordinator.handle('nodes.saveContentTypes', {nodeid: id, types: types}, kontx);
            },
            update: function(node){
                return coordinator.handle('nodes.update', node, kontx);
            }/*,
            query: function(criteria){
                var filters = {},
                    options = {};
                if(!_.isUndefined(criteria)){
                    filters = criteria.filters;
                    options = criteria.options;
                }
                kontx.args = [filters, options];
                return coordinator.handle('contentTypes.query', [filters, options], kontx);
            },
            list: function(options){
                return coordinator.handle('contentTypes.list', [options], kontx);
            }*/
        };
    };
})();