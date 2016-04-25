/**
 * The modelCache module keeps all of the models for contentTypes in memory so that we can quickly access their
 * contents without going back to the database. Any time contentTypes are updated through core their
 * data gets updated in cache.
 */
module.exports = ( function() {
    'use strict';

    var models = {},
        db = require('../db'),
        cache = {};

    cache.initByContentTypeId = function(contentTypeId){
        return db.content.getModel(contentTypeId);
    };

    cache.get = function(id) {
        return models[id];
    };

    cache.set = function(model){
        models[model._id.toString()] = model;
    };

    cache.list = function(){
        return models;
    };

    return cache;
} )();



