module.exports = (function(){
    'use strict';
    /*jslint node: true */

    var mongoose = require('mongoose'),
        _ = require('underscore'),
        q = require('q'),
        async = require('async'),
        crud = require('./mixins/crud'),
        objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$"),
        collectionName = 'nodes',
        schema = require('./schemas/node'),
        node = Object.create(crud,
            {model: {value: mongoose.model(collectionName, schema)}}
        );

    /**
     * Function will look at the id that has been passed to the module and
     * if it is a string send it back, if it is an object with an `id` property
     * then it will check to see if it is a valid mongo objectid format and then
     * send it back.
     * @param id
     * @returns {*}
     */
    function getId(id){
        if(_.isObject(id) && !_.isUndefined(id.id)){
            if (objectIdRegex.test(id.id)) {
                id = id.id;
            }
            else {
                id = null;
            }
        }
        return id;
    }

    function handleNode(err, doc, deferred){

        if(err) {
            deferred.reject(err);
        }
        else if (doc !== null) {
            deferred.resolve(doc);
        }
        else {
            deferred.resolve(new Error('Node does not exist'));
        }
    }

    function getAncestors(id, next){
        var ancestors = [];

        if(id !== null && id !== ''){
            node.getById(id.toString())
                .then(function(doc){
                    if(doc && doc.ancestors){
                        _.each(doc.ancestors, function(item){
                            ancestors.push(item._id);
                        });
                    }
                    ancestors.push(id);

                    next(null, ancestors);
                });
        }
        else {
            next(null, ancestors);
        }
    }

    node.insert = function(obj){
        var self = this,
            deferred = q.defer();

        function create(ancestors, next){
            obj.ancestors = ancestors;

            self.model.create(obj, function(err, doc){
                if(err) {
                    deferred.reject(self.handleError(err));
                    return;
                }

                self.getById(doc._id.toString())
                    .then(function(cleanObj){
                        next(null, cleanObj);
                    })
                    .fail(function(err){
                        next(err);
                    });
            });
        }


        function done(err, results){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        }

        async.waterfall([
            async.apply(getAncestors, obj.parent),
            function(ancestors, next){ create(ancestors, next ); }
        ],done);

        return deferred.promise;
    };

    node.update = function(obj){
        var self = this,
            deferred = q.defer();

        function update(ancestors, next){
            var primaryKey = _.extend({}, obj)._id;
            delete obj._id;
            obj.ancestors = ancestors;

            self.model.findById(primaryKey, function(err, doc) {
                if(err) {  next(self.handleError(err)); return; }
                if(!doc) { next(new Error('Document does not exist.')); return; }

                _.each(_.keys(obj), function(key){
                    try{
                        doc[key] = obj[key];
                    }
                    catch(ex){
                        console.log(ex);
                    }
                });

                doc.save(function(err){
                    if(err){  next(self.handleError(err)); return; }

                    self.getById(primaryKey.toString()).then(function(cleanObj){
                        next(null, cleanObj);
                    })
                        .fail(function(err){
                            next(err);
                        });
                });
            });
        }

        function done(err, results){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        }

        async.waterfall([
            async.apply(getAncestors, obj.parent),
            function(ancestors, next){ update(ancestors, next ); }
        ],done);

        return deferred.promise;
    };

    node.getById = function(id) {
        var deferred = q.defer();
        id = getId(id);

        this.model.findById(id, this.buildIncludes())
            .populate('allowedTypes parent ancestors', '_id label helpText')
            .lean()
            .exec(function(err, doc){
                handleNode(err, doc, deferred);
            });

        return deferred.promise;
    };

    node.getByParent = function(id){
        var deferred = q.defer();

        id = getId(id);
        this.model.find(
            {parent: id}, this.buildIncludes(), {sort: {label:1}})
            .populate('allowedTypes parent ancestors', '_id label')
            .lean()
            .exec(function(err, doc){
                handleNode(err, doc, deferred);
            });

        return deferred.promise;
    };

    node.saveContentTypes = function(id, types){
        var deferred = q.defer();
        id = getId(id);
        this.model.findById(id, function(err, doc){
            if(err){
                deferred.reject(err);
                return;
            }

            doc.allowedTypes = [];
            _.each(types, function(item){
                var type = _.isString(item) ? item : item.id;
                doc.allowedTypes.addToSet(type);
            });

            doc.save(function (err) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve('Success');
                }
            });
        });

        return deferred.promise;
    };

    return node;
})();