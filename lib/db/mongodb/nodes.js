"use strict";
/*jslint node: true */

var mongoose = require('mongoose'),
    _ = require("underscore"),
    q = require("q"),
    async = require("async"),
    crud = require("./mixins/crud"),
    collectionName = "nodes",
    schema = require('./schemas/node'),
    contentTypeSchema = require('./schemas/contentType'),
    contentTypeModel = mongoose.model('contentTypes', contentTypeSchema),
    node = Object.create(crud,
        {model: {value: mongoose.model(collectionName, schema)}}
    );


function handleNode(err, doc, deferred){

    if(err) {
        deferred.reject(err);
    }
    else if (doc != null) {
        deferred.resolve(doc);
    }
    else {
        deferred.resolve(new Error("Node does not exist"));
    }
}

function getAncestors(id, next){
    var ancestors = [];

    if(id != null && id != ""){
        node.getById(id)
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

node.create = function(obj){
    var self = this,
        deferred = q.defer();

    function create(ancestors, next){
        obj.ancestors = ancestors;
        self.model.create(obj, function(err, doc){
            if(err) {
                deferred.reject(self.handleError(err));
                return;
            }

            self.getById(doc._id)
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
            if(!doc) { next(new Error("Document does not exist.")); return; }

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

                self.getById(primaryKey).then(function(cleanObj){
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

    this.model.findById(id, this.buildIncludes()).populate('allowedTypes parent ancestors', "_id label helpText").lean().exec(function(err, doc){
        handleNode(err, doc, deferred);
    });

    return deferred.promise;
};

node.getBySlug = function(slug) {
    var deferred = q.defer();

    this.model.findOne({slug: slug}, this.buildIncludes()).populate('allowedTypes parent ancestors', "_id label").lean().exec(function(err, doc){
        handleNode(err, doc, deferred);
    });

    return deferred.promise;
};

node.getByParent = function(id){
    var deferred = q.defer();

    this.model.find({parent: id}, this.buildIncludes()).populate('allowedTypes parent ancestors', "_id label").lean().exec(function(err, doc){
        handleNode(err, doc, deferred);
    });

    return deferred.promise;
};

node.addContentTypes = function(id, types){
    var deferred = q.defer();

    this.model.findById(id, function(err, doc){
        if(err){
            deferred.reject(err);
            return;
        }

        doc.allowedTypes = [];
        _.each(types, function(item){
            doc.allowedTypes.addToSet(item.id);
        });

        doc.save(function (err) {
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve("Success");
            }
        });
    });

    return deferred.promise;
};

module.exports = node;