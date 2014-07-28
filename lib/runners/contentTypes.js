module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        _ = require('lodash');

    coordinator.use('contentTypes.getById', [
        middleware.identity,
        middleware.role(roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.getById,
        middleware.event('out')
    ]);

    coordinator.use('contentTypes.list', [
        middleware.identity,
        middleware.role(roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.list,
        middleware.event('out')
    ]);

    coordinator.use('contentTypes.update', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.update,
        middleware.contentTypes.setTypeCache,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('contentTypes.insert', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.insert,
        middleware.contentTypes.setTypeCache,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('contentTypes.query', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.contentTypes.query,
        middleware.event('out')
    ]);

    coordinator.use('contentTypes.deleteById', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.deleteById,
        middleware.event('out'),
        middleware.event('delete')
    ]);

    return function contentTypes(kontx){
        return {
            insert: function(contentType){
                return coordinator.handle('contentTypes.insert', contentType, kontx);
            },
            deleteById: function(id){
                return coordinator.handle('contentTypes.deleteById', [id], kontx);
            },
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
                if(_.isUndefined(options)) {
                    options = {
                        sort : 'label'
                    };
                } else if(!_.isUndefined(options) && _.isUndefined(options.sort)){
                   options.sort = 'label';
                }
                return coordinator.handle('contentTypes.list', [options], kontx);
            }
        };
    };
})();