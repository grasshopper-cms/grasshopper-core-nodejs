module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        _ = require('underscore');


    coordinator.use('content.create', [
        middleware.identity,
        middleware.node.setNodeIdFromArgument,
        middleware.node.requireNodePermissions(security.roles.AUTHOR),
        middleware.content.create
    ]);

    coordinator.use('content.getById', [
        middleware.identity,
        middleware.content.setTempContent,
        middleware.node.requireNodePermissions(security.roles.READER),
        middleware.content.setContentPayload
    ]);

    return function users(kontx){
        return {
            create: function(content){
                return coordinator.handle('content.create', content, kontx);
            },
            deleteById: function(id){
                return coordinator.handle('content.deleteById', {id: id}, kontx);
            },
            getById: function(id){
                return coordinator.handle('content.getById', {id:id}, kontx);
            },
            query: function(criteria){
                var filters = {},
                    options = {};
                if(!_.isUndefined(criteria)){
                    filters = criteria.filters;
                    options = criteria.options;
                }
                kontx.args = [filters, options];
                return coordinator.handle('content.query', [filters, options], kontx);
            },
            update: function(content){
                return coordinator.handle('content.update', [content], kontx);
            },
            list: function(options){
                return coordinator.handle('content.list', [options], kontx);
            }
        };
    };
})();
