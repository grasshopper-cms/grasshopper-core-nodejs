module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        _ = require('underscore');

    return function users(kontx){
        return {
            create: function(node){
                return coordinator.handle('nodes.create', node, kontx);
            },
            deleteById: function(id){
                return coordinator.handle('nodes.deleteById', [id], kontx);
            }
            /*,
            getById: function(id){
                return coordinator.handle('contentTypes.getById', [id], kontx);
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
                return coordinator.handle('contentTypes.list', [options], kontx);
            }*/
        };
    };
})();