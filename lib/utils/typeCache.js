/**
 * The typeCache module keeps all of the contentTypes in memory so that we can quickly access their
 * contents without going back to the database. Any time contentTypes are updated through core their
 * data gets updated in cache.
 */
module.exports = ( function() {
    'use strict';

    var contentTypes = {},
        db = require('../db')(),
        config = require('../config'),
        _ = require('lodash'),
        cache = {};

    db.contentTypes.list({
        query: {},
        limit: config.db.defaultPageSize,
        skip: 0
    }).then(function(types){
        _.each( types, function( type ) {
            contentTypes[type._id.toString()] = type;
        });
    }).catch(function(e) {
        console.log('type cache query error', e);
    });

    cache.get = function(id) {
        return contentTypes[id];
    };

    cache.set = function(type){
        contentTypes[type._id.toString()] = type;
    };

    cache.list = function(){
        return contentTypes;
    };

    return cache;
} )();