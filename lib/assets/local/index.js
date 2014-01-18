module.exports = (function(){
    "use strict";

    var engine = {},
        internal = {},
        fs = require("fs"),
        q = require("q"),
        path = require("path"),
        async = require("async");

    engine.config = function(config){
        internal.config = config;

        return this;
    };

    engine.createDirectory = function(params){
        var deferred = q.defer();

        fs.mkdir(path.join(internal.config.path, params.nodeid), "0755", function(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({message:"Success"});
            }
        });

        return deferred.promise;
    };

    engine.removeDirectory = function(params){
        var deferred = q.defer();

        fs.rmdir(path.join(internal.config.path, params.nodeid), function(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({message:"Success"});
            }
        });

        return deferred.promise;
    };

    engine.list = function(params){
        var deferred = q.defer();

        var p = path.join(internal.config.path, params.nodeid),
            results = [];

        fs.readdir(p, function (err, files) {
            if (err) {
                deferred.resolve(results);
                return;
            }

            async.each(files, function(file, next){
                var stat = fs.statSync(path.join(p, file));

                if(stat.isFile()){
                    results[results.length] = {
                        url: internal.config.urlbase + path.join(params.nodeid, path.basename(file)),
                        size: stat.size,
                        lastmodified: stat.mtime
                    };
                }

                next();
            },function(){
                deferred.resolve(results);
            });
        });

        return deferred.promise;
    };

    engine.find = function(params) {
        var deferred = q.defer();

        var p = path.join(internal.config.path, params.nodeid),
            results = [];

        fs.readdir(p, function (err, files) {
            function buildResult(dir){
                //Put in function to defer loading to prevent hoisting bugs in case of error.
                try {
                    var stat = fs.statSync(path.join(dir, params.filename));
                }
                catch (err) {
                    deferred.reject({message:'[404]'});
                    return;
                }

                if(stat.isFile()){
                    results = {
                        url: internal.config.urlbase + path.join(params.nodeid, path.basename(params.filename)),
                        size: stat.size,
                        lastmodified: stat.mtime
                    };
                }
            }

            if (err) {
                deferred.resolve(results);
                return;
            }

            buildResult(p);
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    engine.rename = function(params){
        var deferred = q.defer();

        var basePath = path.join(internal.config.path, params.nodeid),
            oldPath = path.join(basePath, params.original),
            newPath = path.join(basePath, params.updated);

        fs.rename(oldPath, newPath, function(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({message:"Success"});
            }
        });

        return deferred.promise;
    };

    engine.move = function(params){
        var deferred = q.defer();

        var oldPath = path.join(internal.config.path, params.nodeid, params.filename),
            newPath = path.join(internal.config.path, params.newnodeid, params.filename);

        fs.rename(oldPath, newPath, function(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({message:"Success"});
            }
        });

        return deferred.promise;
    };

    engine.copy = function(params){
        var deferred = q.defer();

        var oldPath = path.join(internal.config.path, params.nodeid, params.filename),
            newPath = path.join(internal.config.path, params.newnodeid, params.filename);

        fs.readFile(oldPath, function(err, data){
            if(err) {
                deferred.reject(err);
                return;
            }

            fs.writeFile(newPath, data, 'binary', function(err){
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve({message:"Success"});
                }
            });
        });

        return deferred.promise;
    };

    engine.delete = function(params){
        var filePath = path.join(internal.config.path, params.nodeid, params.filename),
            deferred = q.defer();

        fs.unlink(filePath, function(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({message:"Success"});
            }
        });

        return deferred.promise;
    };

    engine.deleteAll = function(params){
        var dirPath = path.join(internal.config.path, params.nodeid),
            deferred = q.defer();

        fs.readdir(dirPath, function(err, files){
            if(err){
                deferred.reject(err);
                return;
            }

            function rmFile(file, next){
                fs.unlink(path.join(dirPath, file), function(err){
                    next(err);
                });
            }

            function done(err){
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve({message:"Success"});
                }
            }

            async.each(files,rmFile, done);
        });

        return deferred.promise;
    };

    engine.save = function(params){
        var fullPath = path.resolve(internal.config.path, params.nodeid, params.filename),
            deferred = q.defer();

        fs.readFile(params.path, function(err, data){
            if(err){
                deferred.reject(err);
                return;
            }

            fs.writeFile(fullPath, data, 'binary', function(err){
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve({message:"Success"});
                }
            });
        });

        return deferred.promise;
    };
    return engine;
})();