/**
 * The listener module is responsible for mapping event handlers to a set of criteria (filters). When the named
 * event is emitted we then look and see if there are filters that are listening for the event. If there are
 * then we call the event handler.
 */
module.exports = (function() {
    'use strict';

    var _ = require('lodash'),
        filter = require('./filter'),
        listeners = [],
        publicObj = {};

    function arraysSame(arrays) {
        return _.every(arrays, function(array) {
            return array.length === arrays[0].length && _.difference(array, arrays[0]).length === 0;
        });
    }

    function getListenersByName(name) {
        return _.filter(listeners, function(item){
                return item.name === name;
            });
    }

    function listenerFiltersSame(listener, filters){
        var isSame = false;

        if( arraysSame([listener.filters.nodes, filters.nodes] ) &&
            arraysSame([listener.filters.types, filters.types] ) &&
            arraysSame([listener.filters.system, filters.system] ) &&
            arraysSame([listener.filters.contentids, filters.contentids] ) ) {

            isSame = true;
        }

        return isSame;
    }

    /**
     * The register function maps a named event with a set of criteria and attach it's handler.
     *
     * @param name
     * @param filters
     * @param handler
     */
    publicObj.register = function(name, filters, handler) {
        var listenersWithSameName = getListenersByName(name),
            existingListener;

        // No listeners exist for this name, just register it.
        if( listenersWithSameName.length === 0 ){
            listeners.push( { name: name, filters: filters, handlers: [ handler ] });
        }
        else {
            _.each(listenersWithSameName, function(listener) {
                // If all of the filters are the same then we don't want to reregister the listener.
                if( listenerFiltersSame(listener, filters ) ) {
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

    publicObj.unregister = function(name, filters) {
        var deletedIdx;

        _.each(listeners, function(listener, idx) {
            if( listener.name === name && listenerFiltersSame(listener, filters ) ) {
                deletedIdx = idx;
            }
        });

        if( !_.isUndefined(deletedIdx) ) {
            listeners.splice(deletedIdx, 1);
        }
    };

    /**
     * Filter function will inspect all of the registered listeners and return all of the
     * event handlers that match an event's name and filter requirements.
     *
     * @param name - Event name
     * @param filters - Required filter parameters
     * @returns {Array} - Array of handlers
     */
    publicObj.filter = function(name, filters){
        return filter(listeners).get(name).exec(filters);
    };

    return publicObj;
})();
