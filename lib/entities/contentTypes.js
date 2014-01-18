(function(){
    "use strict";

    var contentTypes = {},
        db = require("../db"),
        config = require("../config"),
        log = require("solid-logger-js").init(config.logger),
        _ = require("underscore"),
        q = require("q"),
        async = require("async");

    contentTypes.create = function(obj){
        return db.contentTypes.create(obj);
    };

    contentTypes.deleteById = function(id){
        //[TODO] Make sure to delete content associated to this content type
        return db.contentTypes.deleteById(id);
    };

    contentTypes.update = function(obj){
        return db.contentTypes.update(obj);
    };

    contentTypes.getById = function(id){
        return db.contentTypes.getById(id);
    };

    contentTypes.list = function(options){
        var deferred = q.defer();

        async.parallel(
            [
                function(next){
                    db.contentTypes.list(options)
                        .then(function(value){
                            next(null, value);
                        })
                        .fail(function(err){
                            next(err);
                        });
                },
                function(next){
                    db.contentTypes.describe(options)
                        .then(function(value){
                           next(null, value);
                        })
                        .fail(function(err){
                            next(err);
                        });
                }
            ],function(err, results){
                if(err){
                    deferred.reject(err);
                }
                else {
                    var total = 0;

                    if(results[1][0]){
                        total = results[1][0].count;
                    }
                    deferred.resolve({
                        total: total,
                        results: results[0]
                    });
                }
            }
        );

        return deferred.promise;
    };

    module.exports = contentTypes;
})();

