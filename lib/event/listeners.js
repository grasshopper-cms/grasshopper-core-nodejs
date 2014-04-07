/**
 * The listener module is responsible for mapping event handlers to a set of criteria (filters). When the named
 * event is emitted we then look and see if there are filters that are listening for the event. If there are
 * then we call the event handler.
 */
module.exports = (function() {
    'use strict';

    var _ = require('underscore'),
        filter = require('./filter'),
        listeners = [],
        publicObj = {};

    function arraysSame(arrays) {
        return _.all(arrays, function(array) {
            return array.length === arrays[0].length && _.difference(array, arrays[0]).length === 0;
        });
    }

    /**
     * The register function maps a named event with a set of criteria and attach it's handler.
     *
     * @param name
     * @param filters
     * @param handler
     */
    publicObj.register = function(name, filters, handler) {
        var listenersWithSameName = _.filter(listeners, function(item){
                return item.name === name;
            }),
            existingListener;

        // No listeners exist for this name, just register it.
        if( listenersWithSameName.length === 0 ){
            listeners.push( { name: name, filters: filters, handlers: [ handler ] });
        }
        else {
            _.each(listenersWithSameName, function(listener) {
                // If all of the filters are the same then we don't want to reregister the listener.
                if( arraysSame([listener.filters.nodes, filters.nodes] ) &&
                    arraysSame([listener.filters.types, filters.types] ) &&
                    arraysSame([listener.filters.contentids, filters.contentids] ) ) {

                    existingListener = listener;
                }
            });

            if(_.isUndefined(existingListener)){
                listeners.push( { name: name, filters: filters, handlers: [ handler ] });
            }
            else {
                existingListener.handlers.push(handler);
            }
        }
    };

    publicObj.filter = function(name, filters){
        var f = filter(listeners).get(name).exec(filters);
        console.log(f);
    };

    return publicObj;
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