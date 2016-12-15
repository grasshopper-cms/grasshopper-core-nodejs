/*
 The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
 all connections.
 */
module.exports = (function(){
    'use strict';

    var _ = require('lodash'),
        q = require('q'),
        createError = require('../../../utils/error'),
        createSort = require('../utils/sort'),
        Crud = {
            model: null,
            /**
             * Filter/Format errors in a way that the system understands.
             *
             * @param err
             * @returns Error
             */
            handleError: function(err){
                var error = null,
                    keys = null,
                    errMsg = '';

                if(err.name == 'ValidationError'){
                    keys = _.keys(err.errors);

                    if(err.errors[keys[0]].path === 'salt'){
                        //Support for virtual fields.
                        errMsg = err.errors[keys[0]].message;
                    }
                    else if(err.errors[keys[0]].type === 'required'){
                        errMsg = '"' + err.errors[keys[0]].path + '" is a required field.';
                    }
                    else {
                        errMsg = err.errors[keys[0]].message;
                    }

                    error = createError(400, errMsg);
                }
                else if (err.name == 'MongoError' && (err.code == '11001' || err.code == '11000')) {
                    error = createError(400, 'Duplicate key already exists.');
                }
                else {
                    error = createError(err);
                }

                return error;
            },
            insert: function(obj, options){
                var self = this,
                    deferred = q.defer();

                this.model.create(obj, function(err, doc){
                    if(err) {
                        deferred.reject(self.handleError(err));
                    } else {

                        self.getById(doc._id, options)
                            .then(function(cleanObj){
                                deferred.resolve(cleanObj);
                            })
                            .fail(function(err){
                                deferred.reject(createError(err));
                            });
                    }
                });

                return deferred.promise;
            },
            update: function(obj, options){
                var primaryKey = _.extend({}, obj)._id,
                    self = this,
                    deferred = q.defer();

                delete obj._id;

                this.model.findById(primaryKey, function(err, doc) {
                    if(err) {
                        deferred.reject(self.handleError(err));
                        return;
                    }

                    if(doc) {

                        _.each(_.keys(obj), function(key){
                            try{
                                doc[key] = obj[key];
                            }
                            catch(ex){
                                console.log(ex);
                            }
                        });

                        doc.save(function(err){
                            if(err){
                                deferred.reject(self.handleError(err));
                            }
                            else {
                                self.getById(primaryKey, options)
                                    .then(function(data){
                                        deferred.resolve(data);
                                    })
                                    .fail(function(err) {
                                        deferred.reject(createError(err));
                                    });
                            }
                        });
                    }
                    else {
                        deferred.reject(createError(404));
                    }
                });

                return deferred.promise;
            },
            getById: function(id, options) {
                var deferred = q.defer();

                this.model.findById(id, this.buildIncludes(options)).lean().exec(function(err, doc){
                    if(err) {
                        deferred.reject(createError(err));
                    }
                    else if (doc !== null) {
                        deferred.resolve(doc);
                    }
                    else {
                        deferred.reject(createError(404));
                    }
                });

                return deferred.promise;
            },
            getBySlug: function(slug, options) {
                var deferred = q.defer();

                this.model.findOne({'slug':slug}, this.buildIncludes(options)).lean().exec(function(err, doc){
                    if(err) {
                        deferred.reject(createError(err));
                    }
                    else if (doc !== null) {
                        deferred.resolve(doc);
                    }
                    else {
                        deferred.reject(createError(404));
                    }
                });

                return deferred.promise;
            },
            list: function (options){
                var deferred = q.defer();

                this.model.find(options.query,
                    this.buildIncludes(options),
                    {
                        // Cast limit to number
                        limit: + options.limit,
                        skip: options.skip,
                        sort: options.sort
                    }
                ).lean().exec(function (err, docs) {

                        if(err) {
                            deferred.reject(createError(err));
                        }
                        else {
                            // Mongo does not sort case insensitive....
                            if(options.sort) {
                                docs = createSort(docs, options.sort);
                            }
                            deferred.resolve(docs);
                        }
                    });

                return deferred.promise;
            },
            describe: function (){
                var deferred = q.defer();

                this.model.aggregate([
                    {$group : {
                        '_id' : 'count',
                        'count' : {$sum : 1}
                    }}
                ], function (err, items){
                    if(err) {
                        deferred.reject(createError(err));
                    } else {
                        deferred.resolve(items);
                    }
                });

                return deferred.promise;
            },
            deleteById: function(id){
                var deferred = q.defer();

                this.model.findByIdAndRemove(id, { }, function(err){
                    if(err) {
                        deferred.reject(createError(err));
                    } else {
                        deferred.resolve('Success');
                    }
                });

                return deferred.promise;
            }
        };

    _.extend(Crud, require('./fields'));

    return Crud;
})();
