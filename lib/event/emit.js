/**
 * Module that is a function that will get a list of handlers for a named event.
 * Then call each of the handlers with the passed in payload.
 *
 * IMPORTANT: All event handlers are simply middleware that is used in our system. They have direct access to
 * the kontx and have the ability to halt the deferred chain by passing back an exception.
 *
 * @param name - Name of the event
 * @param filter - Event filter (node, type, contentid)
 * @param payload - Custom object that will get passed to the event handler
 */
module.exports = function ( name, filter, payload ) {
    'use strict';

    var async = require('async'),
        q = require('q'),
        listeners = require('./listeners'),
        handlers = listeners.filter(name, filter),
        deferred = q.defer();

    /**
     * Call each event handler in order, then when we are done either resolve or reject the deferred.
     */
    async.applyEachSeries(handlers, payload, function(err){
        if(err){
            deferred.reject(err);
        }
        else {
            deferred.resolve(payload);
        }
    });

    return deferred.promise;
};