var config = require('../../grasshopper');

module.exports = (function(){
    'use strict';

    var engine = {},
        AWS = require('aws-sdk'),
        createError = require('../../utils/error'),
        sort = require('../sort'),
        async = require('async'),
        q = require('q'),
        fs = require('fs'),
        path = require('path'),
        url = require('url'),
        mime = require('mime'),
        internal = {},
        LOGGING_CATEGORY = 'AWS-ASSET-MANAGER',
        grasshopper = require('../../grasshopper');

    internal.buildKey = function(nodeid, filename, prefix) {
        var result = (internal.config.assetsDir ? internal.config.assetsDir + '/' : '') + nodeid + (filename ? '/' + filename.replace(/\s/g, grasshopper.config.assets.filenameSpaceReplacement) : '');
        return prefix ? prefix + '/' + result : result;
    };

    internal.constructUrl = function(fileKey){
        return url.resolve(internal.config.urlbase, path.join(internal.config.bucket,fileKey));
    };

    internal.putObject = function(nodeid, filename, path){
        var self = this,
            deferred = q.defer();

        fs.stat(path, function(err, info) {
            var stream = fs.createReadStream(path);

            self.s3.putObject({
                Bucket: internal.config.bucket,
                ACL: 'public-read',
                Key: internal.buildKey(nodeid, filename),
                ContentLength: info.size,
                ContentType : mime.lookup(path),
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

    internal.copyObject = function(sourceNodeId, sourceName, destNodeId, destName, destPrefix){
        var deferred = q.defer();

        this.s3.copyObject({
            Bucket: internal.config.bucket,
            ACL: 'public-read',
            CopySource: internal.config.bucket + '/' + internal.buildKey(sourceNodeId, sourceName),
            Key: internal.buildKey(destNodeId, destName, destPrefix)
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
        var deferred = q.defer(),
            self = this,
            archiveBucket = internal.config.archiveDeletionsTo,
            key = internal.buildKey(nodeid, filename);

        if (archiveBucket) {
            internal.copyObject(nodeid, filename, nodeid, filename, archiveBucket)
                .fail(function(err){
                    deferred.reject(err);
                })
                .then(function(){
                    self.s3.deleteObject({
                        Bucket: internal.config.bucket,
                        Key: key
                    }, function (err, data) {
                        if(err){
                            deferred.reject(err);
                        }
                        else {
                            deferred.resolve(data);
                        }
                    });
                });

        } else {
            this.s3.deleteObject({
                Bucket: internal.config.bucket,
                Key: key
            }, function (err, data) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(data);
                }
            });
        }
        return deferred.promise;
    };

    internal.listObjects = function(nodeid){
        var allKeys = [],
            deferred = q.defer();

        if (nodeid) {
            this.s3.listObjects({
                Bucket: internal.config.bucket,
                Prefix: internal.buildKey(nodeid)
            }, function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    allKeys.push(data.Contents);
                    deferred.resolve(allKeys);
                }
            });
        } else {
            // Cannot add assets to root node, and do not want to return all results for entire bucket, so show empty
            deferred.resolve([[]]);
        }
        return deferred.promise;
    };

    internal.getObject = function(nodeid, filename) {
        var deferred = q.defer();

        this.s3.getObject({
            Bucket: internal.config.bucket,
            Key: internal.buildKey(nodeid, filename)
        }, function(err, data) {
                if (err) {
                    if(err.statusCode === 404){
                        deferred.reject(createError(404));
                    }
                    else {
                        deferred.reject(err);
                    }
                    return;
                }
            deferred.resolve(data);
        });

        return deferred.promise;
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

        internal.s3 = new AWS.S3();
        internal.validateBucket(config.bucket);

        return this;
    };

    engine.createDirectory = function(){
        //Amazon does not have logical directories. We are implementing this method just to conform to contract.
        var deferred = q.defer();
        deferred.resolve({message: 'Success'});
        return deferred.promise;
    };

    engine.removeDirectory = function(){
        //Amazon does not have logical directories. We are implementing this method just to conform to contract.
        var deferred = q.defer();
        deferred.resolve({message: 'Success'});
        return deferred.promise;
    };

    engine.rename = function(params){
        var deferred = q.defer();

        function copy(next){
            internal.copyObject(params.nodeid, params.original, params.nodeid, params.updated)
                .then(function(){
                    next();
                })
                .fail(function(err){
                    next(err);
                });
        }

        function del(next){
            internal.deleteObject(params.nodeid, params.original)
                .then(function(){
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
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

        function copyKeys(keys,next){
            var counter,
                archiveBucket = internal.config.archiveDeletionsTo;

            if (archiveBucket) {
                if(keys.length > 0){
                    counter = keys.length;
                    keys.map(function(key) {
                        key = key.Key;
                        internal.s3.copyObject({
                            Bucket: internal.config.bucket,
                            ACL: 'public-read',
                            CopySource: path.join(internal.config.bucket, key),
                            Key: path.join(archiveBucket, key)
                        }, function (err) {
                            --counter;
                            // we are ignoring any errors
                            if (err) {
                                console.log('error copying key', err);
                            }
                            if (counter <= 0) {
                                next(null, keys);
                            }
                        });

                    });
                }
            } else {
                next();
            }
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

        async.waterfall([getAllKeys, copyKeys, deleteKeys], done);

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

        internal.getObject(params.nodeid, params.filename)
            .then(function(file){
                var results = {};

                if(file.ContentLength > 0){
                    results = {
                        url: internal.constructUrl(internal.buildKey(params.nodeid, params.filename)),
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
