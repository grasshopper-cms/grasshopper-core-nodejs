module.exports = (function(){
    'use strict';

    var engine = {},
        internal = {},
        fs = require('fs'),
        q = require('q'),
        path = require('path'),
        url = require('url'),
        sort = require('../sort'),
        createError = require('../../utils/error'),
        async = require('async');

    function validate(err, deferred){
        if(err){
            deferred.reject(err);
            return false;
        }

        return true;
    }

    function handleDeferred(err, deferred){
        if(err){
            //This is a 404 and we should handle accordingly
            // errno is 34 in node 10 but -2 in node 11
            if(err.code === 'ENOENT'){
                deferred.reject(createError(404));
            }
            else {
                deferred.reject(err);
            }

        }
        else {
            deferred.resolve({message:'Success'});
        }
    }

    function safeExecute(func, options){
        var domain = require('domain'),
            d = domain.create();

        d.add(options);

        d.on('error', function(err){
            if(options.deferred){
                handleDeferred(err, options.deferred);
            }
        });

        d.run(function(){
            func(options);
        });
    }

    function copyFile(options){
        fs.readFile(options.sourcePath, function(err, data){
            if(validate(err, options.deferred)){
                fs.writeFile(options.destPath, data, 'binary', function(err){
                    var def = q.defer();

                    if(err){
                        //Destination folder doesn't exist. Create it and try again.
                        // errno is 34 in node 10 but -2 in node 11
                        if(err.code === 'ENOENT'){
                            def.promise.then(function(){
                                safeExecute(copyFile, {
                                    sourcePath: options.sourcePath,
                                    destPath: options.destPath,
                                    deferred: options.deferred,
                                    nodeid: options.nodeid
                                });
                            }).catch(function(err){
                                    handleDeferred(err, options.deferred);
                                });

                            safeExecute(createDirectory, {
                                path: path.join(internal.config.path, options.nodeid),
                                deferred: def
                            });

                        }
                    } else {
                        handleDeferred(err, options.deferred);
                    }
                });
            }
        });
    }

    function deleteAll(options){
        fs.readdir(options.dirPath, function(err, files){
            function rmFile(file, next){
                fs.unlink(path.join(options.dirPath, file), function(err){
                    next(err);
                });
            }

            function done(err){
                handleDeferred(err, options.deferred);
            }

            if(validate(err, options.deferred)){
                async.each(files, rmFile, done);
            }
        });
    }

    function deleteOne(options){
        fs.unlink(options.filePath, function(err){
            handleDeferred(err, options.deferred);
        });
    }

    function rename(options){
        fs.rename(options.sourcePath, options.destPath, function(err){
            handleDeferred(err, options.deferred);
        });
    }

    function createDirectory(options){
        fs.mkdir(options.path, '0755', function(err){
            handleDeferred(err, options.deferred);
        });
    }

    function removeDirectory(options){
        fs.rmdir(options.path, function(err){
            handleDeferred(err, options.deferred);
        });
    }

    engine.config = function(config){
        internal.config = config;

        return this;
    };

    engine.createDirectory = function(params){
        var deferred = q.defer(),
            dirPath = path.join(internal.config.path, params.nodeid);

        safeExecute(createDirectory, {
            path: dirPath,
            deferred: deferred
        });

        return deferred.promise;
    };

    engine.removeDirectory = function(params){
        var deferred = q.defer(),
            dirPath = path.join(internal.config.path, params.nodeid);

        safeExecute(removeDirectory, {
            path: dirPath,
            deferred: deferred
        });

        return deferred.promise;
    };

    engine.list = function(params){
        var deferred = q.defer(),
            nodeid = (params.nodeid) ? params.nodeid : '',
            p = path.join(internal.config.path, nodeid),
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
                        url: url.resolve(internal.config.urlbase,path.join(nodeid, path.basename(file))),
                        size: stat.size,
                        lastmodified: stat.mtime
                    };
                }

                next();
            },function(){
                deferred.resolve(
                    sort(results, 'url')
                );
            });
        });

        return deferred.promise;
    };

    engine.find = function(params) {
        var deferred = q.defer(),
            p = path.join(internal.config.path, params.nodeid),
            results = [];

        fs.readdir(p, function (err) {
            function buildResult(dir){
                //Put in function to defer loading to prevent hoisting bugs in case of error.
                try {
                    var stat = fs.statSync(path.join(dir, params.filename));
                    if(stat.isFile()){
                        results = {
                            url: url.resolve(internal.config.urlbase, path.join(params.nodeid, path.basename(params.filename))),
                            size: stat.size,
                            lastmodified: stat.mtime
                        };
                    }
                }
                catch (err) {
                    var error = new Error('Resource not found');
                    error.code = 404;
                    deferred.reject(error);
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
        var deferred = q.defer(),
            basePath = path.join(internal.config.path, params.nodeid),
            oldPath = path.join(basePath, params.original),
            newPath = path.join(basePath, params.updated);

        safeExecute(rename, {
            sourcePath: oldPath,
            destPath: newPath,
            deferred: deferred
        });

        return deferred.promise;
    };

    engine.move = function(params){
        var deferred = q.defer(),
            oldPath = path.join(internal.config.path, params.nodeid, params.filename),
            newPath = path.join(internal.config.path, params.newnodeid, params.filename);

        safeExecute(rename, {
            sourcePath: oldPath,
            destPath: newPath,
            deferred: deferred
        });

        return deferred.promise;
    };

    engine.copy = function(params){
        var deferred = q.defer(),
            oldPath = path.join(internal.config.path, params.nodeid, params.filename),
            newPath = path.join(internal.config.path, params.newnodeid, params.filename);

        safeExecute(copyFile, {
            sourcePath: oldPath,
            destPath: newPath,
            deferred: deferred,
            nodeid: params.newnodeid
        });

        return deferred.promise;
    };

    engine.delete = function(params){
        var filePath = path.join(internal.config.path, params.nodeid, params.filename),
            deferred = q.defer();

        safeExecute(deleteOne, {
            filePath: filePath,
            deferred: deferred
        });

        return deferred.promise;
    };

    engine.deleteAll = function(params){
        var dirPath = path.join(internal.config.path, params.nodeid),
            deferred = q.defer();

        safeExecute(deleteAll, {
            dirPath: dirPath,
            deferred: deferred
        });

        return deferred.promise;
    };

    engine.save = function(params){
        var fullPath = path.resolve(internal.config.path, params.nodeid, params.filename),
            deferred = q.defer();

        safeExecute(copyFile, {
            sourcePath: params.path,
            destPath: fullPath,
            deferred: deferred,
            nodeid: params.nodeid
        });

        return deferred.promise;
    };
    return engine;
})();