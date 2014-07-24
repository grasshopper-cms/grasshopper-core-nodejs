module.exports = function(listeners){
    'use strict';

    var _ = require('lodash'),
        filter = {};

    /**
     * Function will look at the filters that have been passed in to the module through an
     * emit call and compair them to the filters that are attached to all of the listeners.
     * If there are matches the function will return an array of event handlers that
     * match the criteria.
     *
     * @param filters - Event filters that are passed in through emit
     * @param listener - Listener that has been registered in the application
     * @returns {Array} - Array of event handlers that match the filter criteria
     */
    function findMatch(filters, listener){
        var handlers = [],
            isMatch = true;

        if( !_.isUndefined(listener.filters.nodes) && listener.filters.nodes.length > 0 ) {
            isMatch = !_.isUndefined( _.find( listener.filters.nodes , function(node) {
                return (node === filters.node || node === '*');
            } ) );
        }

        if ( isMatch && !_.isUndefined(listener.filters.types) && listener.filters.types.length > 0 ) {
            isMatch = !_.isUndefined( _.find( listener.filters.types , function(type) {
                return (type === filters.type || type === '*');
            } ) );
        }

        if( isMatch && !_.isUndefined(listener.filters.contentids) && listener.filters.contentids.length > 0 ) {
            isMatch = !_.isUndefined( _.find( listener.filters.contentids , function(contentid) {
                return (contentid === filters.contentid || contentid === '*');
            } ) );
        }

        if( isMatch && !_.isUndefined(listener.filters.system) && listener.filters.system.length > 0 ) {
            isMatch = !_.isUndefined( _.find( listener.filters.system , function(val) {
                return (val === filters.system || val === '*');
            } ) );
        }

        // If we still have a match return handlers attached to the listener
        if( isMatch ) {
            handlers = listener.handlers;
        }

        return handlers;
    }

    /**
     * Function that accepts a collection of listeners and inspects each one to determine
     * if their handler should be called.
     *
     * @param listenerCollection
     * @returns {Function}
     */
    function filterListeners (listenerCollection) {
        return function(filters) {
            var handlers = [];

            _.each(listenerCollection, function(listener){
                handlers = handlers.concat( findMatch(filters, listener) );
            });

            return handlers;
        };
    }

    /**
     * 1) Get all listeners with the same name
     * 2) Test each listener to see if the saved filters matches the criteria of the current event
     * 3) If it matches add handler to an array
     * 4) Return an array of handlers that need to get executed
     *
     * @param name
     * @returns {{exec: *}}
     */
    filter.get = function(name) {
        var listenersWithSameName = _.filter(listeners, function(item){
            return item.name === name;
        });

        return {
            exec: filterListeners(listenersWithSameName)
        };
    };

    return filter;
};