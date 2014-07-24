(function(){
    'use strict';

    var comparisons = require('./comparisons'),
        _ = require('lodash'),
        filterFactory = {};

    filterFactory.createQuery = function(filterCollection, queryReference){
        var obj = {};

        _.each(filterCollection, function(filter){
            obj[filter.key] = comparisons.parse(filter);
        });

        _.extend(queryReference, obj);
    };

    module.exports = filterFactory;
})();