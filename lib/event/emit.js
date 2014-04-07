/**
 * Module that is a function that will get a list of handlers for a named event.
 * Then call each of the handlers with the passed in payload.
 *
 * @param name - Name of the event
 * @param filter - Event filter (node, type, contentid)
 * @param payload - Custom object that will get passed to the event handler
 */
module.exports = function ( name, filter, payload ) {
    'use strict';

    var async = require('async'),
        listeners = require('./listeners'),
        handlers = listeners.filter(name, filter);

    async.each(handlers, function(handler){
        handler(payload);
    });
};