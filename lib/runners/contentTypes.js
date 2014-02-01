module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        security = require('../security'),
        _ = require('underscore');

    coordinator.use('contentTypes.getById', [
        middleware.identity,
        middleware.contentTypes.getById
    ]);

    return function users(kontx){
        return {
            create: function(contentType){
                return coordinator.handle('contentTypes.create', contentType, kontx);
            },
            deleteById: function(id){
                return coordinator.handle('contentTypes.deleteById', [id], kontx);
            },
            getById: function(id){
                return coordinator.handle('contentTypes.getById', {id:id}, kontx);
            },
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
            update: function(contentType){
                return coordinator.handle('contentTypes.update', contentType, kontx);
            },
            list: function(options){
                return coordinator.handle('content.contentTypes', [options], kontx);
            }
        };
    };
})();