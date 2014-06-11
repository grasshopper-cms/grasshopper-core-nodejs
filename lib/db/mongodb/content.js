module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        crud = require('./mixins/crud'),
        q = require('q'),
        async = require('async'),
        _ = require('underscore'),
        collectionName = 'content',
        schema = require('./schemas/content'),
        filterFactory = require('./search/filterFactory'),
        content = Object.create(crud, {
            model: {value: mongoose.model(collectionName, schema)}
        });

    function buildCollection(key, value, queryRef){
        var obj = {};

        if(value && value instanceof Array && value.length > 0){
            obj['meta.' + key] = {$in: value};
        }
        else if(value && typeof value === 'string' && value.length > 0){
            obj['meta.' + key] = value;
        }

        _.extend(queryRef, obj);
    }

    function buildQuery(nodes, types, filters){
        var query = {};

        buildCollection('node', nodes, query);
        buildCollection('type', types, query);
        filterFactory.createQuery(filters, query);

        return query;
    }

    content.updateLabelField = function(type, fieldname){
        var deferred = q.defer();

        this.model.update( { 'meta.type': type } , { $set: { 'meta.labelfield': fieldname } } , { multi:true } )
            .exec(function(err, data){
                if(err){
                    deferred.reject(err);
                    return;
                }

                deferred.resolve({result: true});
            });

        return deferred.promise;
    };

    content.query = function(nodes, types, filters, options){
        var qry = buildQuery(nodes, types, filters),
            deferred = q.defer(),
            self = this,
            builtOptions,
            builtIncludes;


        if (options.distinct) {
            delete options.limit;
            delete options.skip;

            builtOptions = self.buildOptions(options);
            builtIncludes = self.buildIncludes(options);

            self.model.find(qry,
                builtIncludes,
                builtOptions
            ).distinct('fields.label').lean().exec(function (err, data) {
                    var result;

                    if(err){
                        deferred.reject(err);
                    }
                    else {

                        result = {
                            total: data ? data.length : 0,
                            results: data
                        };

                        deferred.resolve(result);
                    }
                });
        } else {
            async.parallel(
                [
                    function(cb){
                        self.model.find(qry,
                            self.buildIncludes(options),
                            self.buildOptions(options)
                        ).lean().exec(function (err, data) {
                                if (err) {
                                    cb(err);
                                }
                                else {
                                    cb(null, data);
                                }
                            });
                    },
                    function(cb){
                        self.model.count(qry).lean().exec(function (err, data) {
                            if (err) {
                                cb(err);
                            }
                            else {
                                cb(null, data);
                            }
                        });
                    }
                ],function(err, results){
                    var result;

                    if(err){
                        deferred.reject(err);
                    }
                    else {

                        result = {
                            total: _.isUndefined(results[1]) ? 0 : results[1],
                            limit: options.limit,
                            skip: options.skip,
                            results: results[0]
                        };

                        deferred.resolve(result);
                    }
                }
            );
        }

        //

        return deferred.promise;
    };

    return content;
})();