(function(){
    'use strict';

    var comparisons = require('./comparisons'),
        _ = require('underscore'),
        filterFactory = {};

    function applyVirtualLabels(value){
        var arr = [],
            keys = [],
            typeCache = require('../../../utils/typeCache'); //Has to be lazy loaded due to timing (requires db connection).

        _.each(typeCache.list(), function(contentType){
            var obj = {},
                fieldLabelId = 'fields.' + _.first(contentType.fields)._id.toString(),
                exists = _.find(keys, function(id){
                    return id === fieldLabelId;
                });

            if(_.isUndefined(exists)){
                obj[fieldLabelId] = value;
                keys.push(fieldLabelId);
                arr.push(obj);
            }
        });

        return arr;
    }

    filterFactory.createQuery = function(filterCollection, queryReference){
        var obj = {};

        _.each(filterCollection, function(filter){
            if(filter.key === 'virtual.label'){
                obj.$and = [{
                    '$or': applyVirtualLabels(comparisons.parse(filter))
                }];
                console.log(obj);
            }
            else {
                obj[filter.key] = comparisons.parse(filter);
            }
        });

        _.extend(queryReference, obj);
    };

    module.exports = filterFactory;
})();