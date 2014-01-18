(function(){
    "use strict";

    var assets = {},
        internal = {},
        async = require("async"),
        q = require('q'),
        fs = require("fs"),
        config = require("../config").get("assets"),
        _ = require("underscore");

    internal.config = config;
    internal.engines = [];
    internal.defaultEngine = null;

    _.each(config.engines, function(engine){
        engine.tmpdir = config.tmpdir;
    });

    if(config.engines.amazon) {
        internal.engines.amazon = require('./aws').config(config.engines.amazon);
    }
    if(config.engines.local){
        internal.engines.local = require('./local').config(config.engines.local);
    }

    internal.defaultEngine = internal.engines[config.default];

    assets.list = function(params){
        return internal.defaultEngine.list(params);
    };

    assets.find = function(params){
        return internal.defaultEngine.find(params);
    };

    assets.createDirectory = function(params){
        var deferred = q.defer();

        function createDirectory(engine, next){
            internal.engines[engine].createDirectory(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), createDirectory, done);

        return deferred.promise;
    };

    assets.removeDirectory = function(params){
        var deferred = q.defer();

        function removeDirectory(engine, next){
            internal.engines[engine].removeDirectory(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), removeDirectory, done);

        return deferred.promise;
    };

    assets.save = function(params){
        var deferred = q.defer();

        function save(engine, next){
            internal.engines[engine].save(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            fs.unlinkSync(params.path);

            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), save, done);

        return deferred.promise;
    };

    assets.rename = function(params){
        var deferred = q.defer();

        function rename(engine, next){
            internal.engines[engine].rename(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), rename, done);

        return deferred.promise;
    };

    assets.move = function(params){
        var deferred = q.defer();

        function move(engine, next){
            internal.engines[engine].move(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), move, done);

        return deferred.promise;
    };

    assets.copy = function(params){
        var deferred = q.defer();

        function copy(engine, next){
            internal.engines[engine].copy(params).done(function(response, err){
                next(err);
            });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), copy, done);

        return deferred.promise;
    };

    assets.delete = function(params){
        var deferred = q.defer();

        function del(engine, next){
            internal.engines[engine].delete(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), del, done);

        return deferred.promise;
    };

    assets.deleteAll = function(params){
        var deferred = q.defer();

        function deleteAll(engine, next){
            internal.engines[engine].deleteAll(params)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({ message: "Success" });
            }
        }

        async.each(_.keys(internal.engines), deleteAll, done);

        return deferred.promise;
    };

    module.exports = assets;
})();