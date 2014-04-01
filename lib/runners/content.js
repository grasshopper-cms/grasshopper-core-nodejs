module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        _ = require('underscore');


    coordinator.batch(
        middleware.content,
        ['insert', 'update'],[
            middleware.identity,
            middleware.nodes.setNodeIdFromArgument,
            middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
            middleware.content.validate
        ]
    );

    coordinator.use('content.query', [
        middleware.identity,
        middleware.role(security.roles.READER),
        middleware.content.query
    ]);

    coordinator.use('content.deleteById', [
        middleware.identity,
        middleware.content.setTempContent,
        middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
        middleware.content.deleteById
    ]);

    coordinator.use('content.getById', [
        middleware.identity,
        middleware.content.setTempContent,
        middleware.nodes.requireNodePermissions(security.roles.READER),
        middleware.content.setContentPayload
    ]);

    return function users(kontx){
        return {
            insert: function(content){
                return coordinator.handle('content.insert', content, kontx);
            },
            deleteById: function(id){
                return coordinator.handle('content.deleteById', [id], kontx);
            },
            getById: function(id){
                return coordinator.handle('content.getById', {id:id}, kontx);
            },
            query: function(criteria){
                var filters = {},
                    options = {},
                    types   = [],
                    nodes   = [];
                if(!_.isUndefined(criteria)){
                    filters = criteria.filters;
                    options = criteria.options;
                    nodes   = criteria.nodes;
                    types   = criteria.types;
                }
                kontx.args = [filters, options];
                return coordinator.handle('content.query', [nodes, types, filters, options], kontx);
            },
            update: function(content){
                return coordinator.handle('content.update', content, kontx);
            },
            list: function(options){
                return coordinator.handle('content.list', [options], kontx);
            }
        };
    };
})();
