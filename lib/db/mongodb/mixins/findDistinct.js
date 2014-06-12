'use strict';
var Q = require('q');

module.exports = function(nodes, types, filters, options, content) {
    var builtOptions,
        builtIncludes,
        deferred = Q.defer();

    delete options.limit;
    delete options.skip;

    builtOptions = content.buildOptions(options);
    builtIncludes = content.buildIncludes(options);

    content.model.find(this,
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

    return deferred.promise;
};
