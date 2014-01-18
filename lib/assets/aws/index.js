module.exports = (function(){
    "use strict";

    var engine = {},
        AWS = require('aws-sdk'),
        config = require("../../config"),
        log = require("solid-logger-js").init(config.logger),
        async = require('async'),
        q = require('q'),
        fs = require('fs'),
        path = require('path'),
        internal = {},
        LOGGING_CATEGORY = "AWS-ASSET-MANAGER";

    internal.constructUrl = function(fileName){
        return path.join(internal.config.urlbase, internal.config.bucket, fileName);
    };

    internal.putObject = function(nodeid, filename, path){
        var self = this,
            deferred = q.defer();

        fs.stat(path, function(err, info) {
            var stream = fs.createReadStream(path);

            self.s3.putObject({
                Bucket: internal.config.bucket,
                ACL: "public-read",
                Key: nodeid + "/" + filename,
                ContentLength: info.size,
                Body: stream
            }, function (err, data) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(data);
                }
            });
        });

        return deferred.promise;
    };

    internal.copyObject = function(sourceNodeId, sourceName, destNodeId, destName){
        var deferred = q.defer();

        this.s3.copyObject({
            Bucket: internal.config.bucket,
            ACL: "public-read",
            CopySource: path.join(this.config.bucket, sourceNodeId, sourceName),
            Key: destNodeId + "/" + destName
        }, function (err, data) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    internal.deleteObject = function(nodeid, filename){
        var deferred = q.defer();

        this.s3.deleteObject({
            Bucket: internal.config.bucket,
            Key: nodeid + "/" + filename
        }, function (err, data) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    internal.listObjects = function(nodeid, marker){
        var allKeys = [],
            deferred = q.defer();

        this.s3.listObjects({Bucket: internal.config.bucket, Prefix: nodeid}, function (err, data) {

            if(err){
                deferred.reject(err);
                return;
            }
            allKeys.push(data.Contents);

            deferred.resolve(allKeys);
        });

        return deferred.promise;
    };

    internal.getObject = function(nodeid, filename) {
        var deferred = q.defer();

        this.s3.getObject({Bucket: internal.config.bucket, key: filename}, function(err, data) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(data.body);
        });

        return deferred.promise;
    };

    internal.validateBucket = function(bucket){
        this.s3.headBucket({Bucket: bucket}, function (err, data) {
            if(err) {
                log.error(LOGGING_CATEGORY, "!!!!!!!!!!! ERROR !!!!!!!!!!!!!");
                log.error(LOGGING_CATEGORY, "There is a problem accessing your Amazon S3 bucket.");
                log.error(LOGGING_CATEGORY, JSON.stringify(err));
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

        internal.s3 = new AWS.S3();
        internal.validateBucket(config.bucket);

        return this;
    };

    engine.createDirectory = function(params){
        //Amazon does not have logical directories. We are implementing this method just to conform to contract.
        var deferred = q.defer();
        deferred.resolve({message: "Success"});
        return deferred.promise;
    };

    engine.removeDirectory = function(params){
        //Amazon does not have logical directories. We are implementing this method just to conform to contract.
        var deferred = q.defer();
        deferred.resolve({message: "Success"});
        return deferred.promise;
    };

    engine.rename = function(params){
        var deferred = q.defer();

        function copy(next){
            internal.copyObject(params.nodeid, params.original, params.nodeid, params.updated)
                .then(function(data){
                    next();
                })
                .fail(function(err){
                    next(err);
                });
        }

        function del(next){
            internal.deleteObject(params.nodeid, params.original)
                .then(function(err, data){
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
                deferred.resolve({message: "Success"});
            }
        }

        async.waterfall([copy, del],done);

        return deferred.promise;
    };

    engine.move = function(params){
        var deferred = q.defer();

        internal.copyObject(params.nodeid, params.filename, params.newnodeid, params.filename)
            .fail(function(err, data){
                deferred.reject(err);
            })
            .then(function(){
                internal.deleteObject(params.nodeid, params.filename)
                    .then(function(){
                        deferred.resolve({message: "Success"});
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
                deferred.resolve({message: "Success"});
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
                deferred.resolve({message: "Success"});
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

                internal.s3.deleteObjects(opts,  function (err, data) {
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
                deferred.resolve({message: "Success"});
            }
        }

        async.waterfall([getAllKeys, deleteKeys], done);

        return deferred.promise;
    };

    engine.save = function(params){
        var deferred = q.defer();

        internal.putObject(params.nodeid, params.filename, params.path)
            .then(function(){
                deferred.resolve({message: "Success"});
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
                    },
                    function(err){
                        deferred.resolve(results);
                    }
                );
            });

        return deferred.promise;
    };

    engine.find = function(params){
        var deferred = q.defer();

        internal.getObject(params.nodeid, params.filename)
            .fail(function(){
                deferred.reject({message: '[404]'});
            })
            .then(function(file){
                var results = {};

                if(file.Size > 0){
                    results = {
                        url: internal.constructUrl(file.Key),
                        size: file.Size,
                        lastmodified: file.LastModified
                    };
                }

                deferred.resolve(results);
            });

        return deferred.promise;
    };

    return engine;
})();