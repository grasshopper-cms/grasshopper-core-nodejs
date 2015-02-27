module.exports = (function(){
    'use strict';

    var engine = {},
        AWS = require('aws-sdk'),
        BB = require('bluebird'),
        createError = require('../../utils/error'),
        sort = require('../sort'),
        async = require('async'),
        fs = BB.promisifyAll(require('fs')),
        path = require('path'),
        url = require('url'),
        mime = require('mime'),
        internal = {},
        LOGGING_CATEGORY = 'AWS-ASSET-MANAGER';

    internal.constructUrl = function(fileName){
        return url.resolve(internal.config.urlbase, path.join(internal.config.bucket,fileName));
    };

    internal.putObject = function(nodeid, filename, path){
        var self = this;

        fs
            .statAsync(path)
            .then(function(info) {
                var stream = fs.createReadStream(path);

                return self.s3.putObjectAsync({
                    Bucket: internal.config.bucket,
                    ACL: 'public-read',
                    Key: nodeid + '/' + filename,
                    ContentLength: info.size,
                    ContentType : mime.lookup(path),
                    Body: stream
                });
            });
    };

    internal.copyObject = function(sourceNodeId, sourceName, destNodeId, destName){

        return this.s3.copyObjectAsync({
            Bucket: internal.config.bucket,
            ACL: 'public-read',
            CopySource: path.join(this.config.bucket, sourceNodeId, sourceName),
            Key: destNodeId + '/' + destName
        });
    };

    internal.deleteObject = function(nodeid, filename){

        return this.s3.deleteObjectAsync({
            Bucket: internal.config.bucket,
            Key: nodeid + '/' + filename
        });
    };

    internal.listObjects = function(nodeid){
        var allKeys = [];

        if (nodeid) {
            return this.s3
                .listObjectsAsync({
                    Bucket: internal.config.bucket,
                    Prefix: nodeid })
                .then(function(data) {
                    allKeys.push(data.Contents);
                    return allKeys;
                });
        } else {
            // Cannot add assets to root node, and do not want to return all results for entire bucket, so show empty
            return BB.resolve([[]]);
        }
    };

    internal.getObject = function(nodeid, filename) {

        return this.s3
            .getObjectAsync({
                Bucket: internal.config.bucket, Key: nodeid + '/' + filename})
            .catch(function(err) {
                if(err.statusCode === 404){
                    throw createError(404);
                }
                else {
                    throw err;
                }
            });
    };

    internal.validateBucket = function(bucket){
        this.s3.headBucket({Bucket: bucket}, function (err) {
            if(err) {
                console.log(LOGGING_CATEGORY, '!!!!!!!!!!! ERROR !!!!!!!!!!!!!');
                console.log(LOGGING_CATEGORY, 'There is a problem accessing your Amazon S3 bucket.');
                console.log(LOGGING_CATEGORY, JSON.stringify(err));
            }
        });
    };

    engine.config = function(config){
        internal.config = config;

        AWS.config.update({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });

        internal.s3 = BB.promisifyAll(new AWS.S3());
        internal.validateBucket(config.bucket);

        return this;
    };

    engine.createDirectory = function(){
        //Amazon does not have logical directories. We are implementing this method just to conform to contract.
        return BB.resolve({message: 'Success'});
    };

    engine.removeDirectory = function(){
        //Amazon does not have logical directories. We are implementing this method just to conform to contract.
        BB.resolve({message: 'Success'});
    };

    engine.rename = function(params){

        function copy(){
            return internal.copyObject(params.nodeid, params.original, params.nodeid, params.updated);
        }

        function del(){
            return internal.deleteObject(params.nodeid, params.original);
        }

        function done(err){
            if(err){
                if(err.statusCode === 404){
                    deferred.reject(createError(404));
                }
                else {
                    deferred.reject(err);
                }
            }
            else {
                deferred.resolve({message: 'Success'});
            }
        }

        
        // TODO: remove and replace with promises
        async.waterfall([copy, del],done);

        return deferred.promise;
    };

    engine.move = function(params){
        var deferred = q.defer();

        internal.copyObject(params.nodeid, params.filename, params.newnodeid, params.filename)
            .fail(function(err){
                deferred.reject(err);
            })
            .then(function(){
                internal.deleteObject(params.nodeid, params.filename)
                    .then(function(){
                        deferred.resolve({message: 'Success'});
                    })
                    .fail(function(err){
                        deferred.reject(err);
                    });
            });

        return deferred.promise;
    };

    engine.copy = function(params){
        var deferred = q.defer();

        internal.copyObject(params.nodeid, params.filename, params.newnodeid, params.filename)
            .then(function(){
                deferred.resolve({message: 'Success'});
            })
            .fail(function(err){
                deferred.reject(err);
            });

        return deferred.promise;
    };

    engine.delete = function(params){
        var deferred = q.defer();

        internal.deleteObject(params.nodeid, params.filename)
            .then(function(){
                deferred.resolve({message: 'Success'});
            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    engine.deleteAll = function(params){
        var deferred = q.defer();

        function getAllKeys(next){
            var keyCollection = [];

            function buildKeyObject(obj, cb){
                keyCollection.push({
                    Key: obj.Key
                });

                cb();
            }

            internal.listObjects(params.nodeid, null)
                .fail(function(err){
                    next(err);
                })
                .then(function(data){
                    async.each(data[0], buildKeyObject, function(err){
                        next(err, keyCollection);
                    });
                });
        }

        function deleteKeys(keys, next){

            if(keys.length > 0){
                var opts = {
                    Bucket: internal.config.bucket,
                    Delete: { Objects: keys }
                };

                internal.s3.deleteObjects(opts,  function (err) {
                    next(err);
                });
            }
            else {
                next();
            }
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({message: 'Success'});
            }
        }

        async.waterfall([getAllKeys, deleteKeys], done);

        return deferred.promise;
    };

    engine.save = function(params){
        var deferred = q.defer();

        internal.putObject(params.nodeid, params.filename, params.path)
            .then(function(){
                deferred.resolve({message: 'Success'});
            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    engine.list = function(params){
        var deferred = q.defer();

        internal.listObjects(params.nodeid, null)
            .fail(function(err){
                deferred.reject(err);
            })
            .then(function(data){
                var results = [];

                async.each(data[0],
                    function(item, next){
                        if(item.Size > 0){
                            results[results.length] = {
                                url: internal.constructUrl(item.Key),
                                size: item.Size,
                                lastmodified: item.LastModified
                            };
                        }
                        next();
                    },function(){
                        deferred.resolve(
                            sort(results, 'url')
                        );
                    }
                );
            });

        return deferred.promise;
    };

    engine.find = function(params){
        var deferred = q.defer();

        internal.getObject(params.nodeid, params.filename).then(
            function(file){
                var results = {};

                if(file.ContentLength > 0){
                    results = {
                        url: internal.constructUrl(params.nodeid + '/' + params.filename),
                        size: file.ContentLength,
                        lastmodified: file.LastModified
                    };
                }

                deferred.resolve(results);
            },
            function(err){
                deferred.reject(err);
            });

        return deferred.promise;
    };

    return engine;
})();
