module.exports = function(listeners){
    'use strict';

    var _ = require('underscore'),
        filter = {};

    function executeFilter (listener) {
        return function(filters) {
            var retVal;

            if( !_.isUndefined(listener) && !_.isUndefined(filters) ) {
                console.log('!!!!!!!!!!!!', filters, listener);
                _.filter(listener.filters.nodes, function(node) {
                    return node === filters.node;
                });
            }
        };
    }

    filter.get = function(name) {
        var listener = _.filter(listeners, function(item){
            return item.name === name;
        });

        return {
            exec: executeFilter(listener)
        };
    };

    return filter;
};