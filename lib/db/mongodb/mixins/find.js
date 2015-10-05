'use strict';
var Q = require('q'),
    async = require('async'),
    _ = require('lodash');

module.exports = function(options, content) {
    var self = this,
        deferred = Q.defer();

    async.parallel(
        [
            function(cb){
                content.model.find(self,
                    content.buildIncludes(options),
                    content.buildOptions(options)
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
                content.model.count(self).lean().exec(function (err, data) {
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

    return deferred.promise;
};