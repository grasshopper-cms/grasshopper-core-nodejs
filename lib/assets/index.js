(function(){
    'use strict';

    var assets = {},
        internal = {},
        async = require('async'),
        BB = require('bluebird'),
        fs = require('fs'),
        config = require('../config').assets,
        _ = require('lodash');

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

        return new BB(function(resolve, reject) {

            function createDirectory(engine, next){
                internal.engines[engine].createDirectory(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(function(err){
                        next(err);
                    });
            }

            function done(err){
                if(err){
                    reject(err);
                } else {
                    resolve({ message: 'Success' });
                }
            }

            // TODO: remove async - confusing to mix w promises
            async.each(_.keys(internal.engines), createDirectory, done);
        });
    };

    assets.removeDirectory = function(params){

        return new BB(function(resolve, reject) {
            function removeDirectory(engine, next){
                internal.engines[engine].removeDirectory(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(next)
                    .done();
            }

            function done(err){
                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), removeDirectory, done);
        });
    };

    assets.save = function(params){

        return new BB(function(resolve, reject) {
            function save(engine, next){
                internal.engines[engine].save(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(next);
            }

            function done(err){
                fs.unlinkSync(params.path);

                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), save, done);
        });
    };

    assets.rename = function(params){
        return new BB(function(resolve, reject) {
            function rename(engine, next){
                internal.engines[engine].rename(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(next);
            }

            function done(err){
                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), rename, done);
        });
    };

    assets.move = function(params){
        return new BB(function(resolve, reject) {
            function move(engine, next){
                internal.engines[engine].move(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(next);
            }

            function done(err){
                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), move, done);
        });
    };

    assets.copy = function(params){

        return new BB(function(resolve, reject) {
            function copy(engine, next){
                internal.engines[engine].copy(params).then(function(){
                    next();
                })
                    .catch(next);
            }

            function done(err){
                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), copy, done);
        });
    };

    assets.delete = function(params){

        return new BB(function(resolve, reject) {
            function del(engine, next){
                internal.engines[engine].delete(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(next);
            }

            function done(err){
                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), del, done);
        });
    };

    assets.deleteAll = function(params){

        return new BB(function(resolve, reject) {
            function deleteAll(engine, next){
                internal.engines[engine].deleteAll(params)
                    .then(function(){
                        next(null);
                    })
                    .catch(next);
            }

            function done(err){
                if(err){
                    reject(err);
                }
                else {
                    resolve({ message: 'Success' });
                }
            }

            async.each(_.keys(internal.engines), deleteAll, done);
        });
    };

    module.exports = assets;
})();