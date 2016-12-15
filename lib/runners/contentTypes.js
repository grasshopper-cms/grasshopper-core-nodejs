module.exports = (function() {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('../middleware'),
        roles = require('../security/roles'),
        Kontx = require('../utils/kontx'),
        _ = require('lodash');

    coordinator.use('contentTypes.getById', [
        middleware.identity,
        middleware.role(roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.getById,
        middleware.event('out')
    ]);

    coordinator.use('contentTypes.getBySlug', [
        middleware.identity,
        middleware.role(roles.AUTHOR),
        middleware.event('parse'),
        middleware.event('validate'),
        middleware.contentTypes.getBySlug,
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
        middleware.contentTypes.addFieldUid,
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
        middleware.contentTypes.addFieldUid,
        middleware.contentTypes.insert,
        middleware.contentTypes.setTypeCache,
        middleware.event('out'),
        middleware.event('save')
    ]);

    coordinator.use('contentTypes.query', [
        middleware.identity,
        middleware.role(roles.ADMIN),
        middleware.query('contentTypes'),
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

    return function contentTypes(token){
        return {
            insert: function(contentType){
                return coordinator.handle('contentTypes.insert', contentType, Kontx(token));
            },
            deleteById: function(id){
                return coordinator.handle('contentTypes.deleteById', [id], Kontx(token));
            },
            getById: function(id){
                return coordinator.handle('contentTypes.getById', [id], Kontx(token));
            },
            getBySlug: function(id){
                return coordinator.handle('contentTypes.getBySlug', [id], Kontx(token));
            },
            query: function(criteria){
                return coordinator.handle('contentTypes.query', criteria, Kontx(token));
            },
            update: function(contentType){
                return coordinator.handle('contentTypes.update', contentType, Kontx(token));
            },
            list: function(options){
                if(_.isUndefined(options)) {
                    options = {
                        sort : 'label'
                    };
                } else if(!_.isUndefined(options) && _.isUndefined(options.sort)){
                   options.sort = 'label';
                }
                return coordinator.handle('contentTypes.list', [options], Kontx(token));
            }
        };
    };
})();
