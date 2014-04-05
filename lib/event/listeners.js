/**
 * The listener module is responsible for mapping event handlers to a set of criteria (filters). When the named
 * event is emitted we then look and see if there are filters that are listening for the event. If there are
 * then we call the event handler.
 */
module.exports = (function listener() {
    'use strict';

    var _ = require('underscore'),
        listeners = [],
        listener = {};

    /**
     * The register function maps a named event with a set of criteria and attach it's handler.
     *
     * @param name
     * @param filters
     * @param handler
     */
    listener.register = function(name, filters, handler) {
        var listenersWithSameName = _.filter(listeners, function(item){
            return item.name === name;
        });

        // No listeners exist for this name, just register it.
        if(_.isUndefined(listenersWithSameName)){
            listeners.push( { name: name, filters: filters, handlers: [ handler ] });
        }
        else {

        }
        console.log(listenersWithSameName);

        //listeners.push({name, filters, callback});
    };

    return listener;
})();
/*
var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    util = require('util'),
    Emmitter = function() {
        this.trigger = function( target, payload ) {

            this.emit( target, payload );
        };
    };

util.inherits(Emmitter, events.EventEmitter);

module.exports = new Emmitter();



emitter.emit("someEvent");*/