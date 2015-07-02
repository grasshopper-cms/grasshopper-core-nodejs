'use strict';

var engine = {},
    AWS = require('aws-sdk'),
    createError = require('../../utils/error'),
    sort = require('../sort'),
    async = require('async'),
    BB = require('bluebird'),
    fs = BB.promisifyAll(require('fs')),
    path = require('path'),
    url = require('url'),
    mime = require('mime'),
    internal = {},
    LOGGING_CATEGORY = 'AWS-ASSET-MANAGER',
    _ = require('lodash');

module.exports = engine;

internal.constructUrl = function(fileName){
    return url.resolve(internal.config.urlbase, path.join(internal.config.bucket,fileName));
};

internal.putObject = function(nodeid, filename, path){
    var self = this;

    return fs.statAsync(path)
        .then(function(info) {
            var stream = fs.createReadStream(path);

            self.s3.putObject({
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

    var self = this;

    // TODO: look into whether you can promisify S3 easilly

    return new BB(function(resolve) {
        self.s3.copyObject({
            Bucket: internal.config.bucket,
            ACL: 'public-read',
            CopySource: path.join(this.config.bucket, sourceNodeId, sourceName),
            Key: destNodeId + '/' + destName
        }, function (err, data) {
            if(err){
                throw err;
            }
            else {
                resolve(data);
            }
        });
    });
};

internal.deleteObject = function(nodeid, filename){

    var self = this;
    return new BB(function(resolve) {
        self.s3.deleteObject({
            Bucket: internal.config.bucket,
            Key: nodeid + '/' + filename
        }, function (err, data) {
            if(err){
                throw err;
            }
            else {
                resolve(data);
            }
        });
    });
};

internal.listObjects = function(nodeid){
    var self = this;

    return new BB(function(resolve) {
        if (nodeid) {
            self.s3.listObjects({
                Bucket: internal.config.bucket,
                Prefix: nodeid
            }, function(err, data) {
                if (err) {
                    throw err;
                } else {
                    resolve([ data.Contents ]);
                }
            });
        } else {
            // Cannot add assets to root node, and do not want to return all results for entire bucket, so show empty
            resolve([[]]);
        }
    });
};

internal.getObject = function(nodeid, filename) {
    var self = this;

    return new BB(function(resolve) {
        self.s3.getObject({Bucket: internal.config.bucket, Key: nodeid + '/' + filename}, function(err, data) {
            if (err) {
                if(err.statusCode === 404){
                    throw createError(404);
                }
                else {
                    throw err;
                }
            }
            resolve(data);
        });
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

    internal.s3 = new AWS.S3();
    internal.validateBucket(config.bucket);

    return this;
};

engine.createDirectory = function(){
    //Amazon does not have logical directories. We are implementing this method just to conform to contract.
    return BB.resolve({message: 'Success'});
};

engine.removeDirectory = function(){
    //Amazon does not have logical directories. We are implementing this method just to conform to contract.
    return BB.resolve({message: 'Success'});
};

engine.rename = function(params){

    return internal
        .copyObject(params.nodeid, params.original, params.nodeid, params.updated)
        .then(function() {
            return internal.deleteObject(params.nodeid, params.original);
        })
        .then(function() {
            return {message: 'Success'};
        })
        .catch(function(err) {
            if (404 === err.statusCode) {
                throw createError(404);
            }
            throw err;
        });
};

engine.move = function(params){

    return internal
        .copyObject(params.nodeid, params.filename, params.newnodeid, params.filename)
        .then(function() {
            return internal.deleteObject(params.nodeid, params.filename);
        })
        .then(function(){
            return {message: 'Success'};
        });
};

engine.copy = function(params){

    return internal
        .copyObject(params.nodeid, params.filename, params.newnodeid, params.filename)
        .then(function(){
            return {message: 'Success'};
        });
};

engine.delete = function(params){

    return internal
        .deleteObject(params.nodeid, params.filename)
        .then(function(){
            return {message: 'Success'};
        });
};

engine.deleteAll = function(params){

    return BB
        .try(getAllKeys)
        .then(deleteKeys)
        .then(function() {
            return {message: 'Success'};
        });

    function getAllKeys(){
        return internal.listObjects(params.nodeid, null)
            .then(function(data){
                return data[0].map(function(obj) {
                    return {
                        Key: obj.Key
                    };
                });
            });
    }

    function deleteKeys(keys){

        if(keys.length > 0){
            return internal.s3.deleteObjects({
                Bucket: internal.config.bucket,
                Delete: { Objects: keys }
            });
        }
    }
};

engine.save = function(params){
    return internal.putObject(params.nodeid, params.filename, params.path)
        .then(function(){
            return {message: 'Success'};
        });
};

engine.list = function(params){

    return internal.listObjects(params.nodeid, null)
        .then(function(data){

            return _.chain(data[0])
                .map(function(item) {
                    if(item.Size > 0){
                        return {
                            url: internal.constructUrl(item.Key),
                            size: item.Size,
                            lastmodified: item.LastModified
                        };
                    }
                })
                .compact()
                .value();
        })
        .then(function(results) {
            return sort(results, 'url');
        });
};

engine.find = function(params){

    return internal.getObject(params.nodeid, params.filename)
        .then(function(file){
            var results = {};

            if(file.ContentLength > 0){
                results = {
                    url: internal.constructUrl(params.nodeid + '/' + params.filename),
                    size: file.ContentLength,
                    lastmodified: file.LastModified
                };
            }

            return results;
        });
};

