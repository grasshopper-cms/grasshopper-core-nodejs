(function(){
    'use strict';

    var comparisons = require('./comparisons'),
        _ = require('lodash'),
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
        var obj = {
                $and : []
            },
            tempObj;

        _.each(filterCollection, function(filter){
            if(_.isArray(filter.key)){
                var queryArgs = [];

                _.each(filter.key, function(key){
                    var tmpFilter = _.extend(filter, {key: key}),
                        queryObj = {};

                    queryObj[key] = comparisons.parse(tmpFilter);
                    queryArgs.push(queryObj);
                });

                obj.$and.push({
                    '$or': queryArgs
                });

            }
            else if(filter.key === 'virtual.label'){
                obj.$and.push({
                    '$or': applyVirtualLabels(comparisons.parse(filter))
                });
            }
            else {
                tempObj = {};
                tempObj[filter.key] = comparisons.parse(filter);
                obj.$and.push(tempObj);
            }
        });

        if (! obj.$and.length) {
            delete obj.$and;
        }

        _.extend(queryReference, obj);
    };

    module.exports = filterFactory;
})();
