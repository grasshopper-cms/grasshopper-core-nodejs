/*
 The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
 all connections.
 */
module.exports = (function(){
    'use strict';

    var _ = require('underscore'),
        q = require('q'),
        createError = require('../../../utils/error'),
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
                    keys = _.keys(err.errors);

                if(err.name == 'ValidationError'){
                    error = createError(err.errors[keys[0]].message);
                }
                else if (err.name == 'MongoError' && err.code == '11000') {
                    error = createError('Duplicate key already exists.');
                }
                else {
                    error = createError(err);
                }

                return error;
            },
            create: function(obj){
                var self = this,
                    deferred = q.defer();

                this.model.create(obj, function(err, doc){
                    if(err) {
                        deferred.reject(self.handleError(err));
                    } else {

                        self.getById(doc._id)
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
            update: function(obj){
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
                                self.getById(primaryKey)
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
            getById: function(id) {
                var deferred = q.defer();

                this.model.findById(id, this.buildIncludes()).lean().exec(function(err, doc){
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
                        limit: options.limit,
                        skip: options.skip
                    }
                ).lean().exec(function (err, docs) {

                        if(err) {
                            deferred.reject(createError(err));
                        }
                        else {
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
                        deferred.resolve(null);
                    }
                });

                return deferred.promise;
            }
        };

    _.extend(Crud, require('./fields'));

    return Crud;
})();