"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    q = require("q"),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    filterFactory = require('./search/filterFactory'),
    content = Object.create(crud, {
        model: {value: mongoose.model(collectionName, schema)}
    });

function buildCollection(key, value, queryRef){
    var obj = {};

    if(value && value instanceof Array && value.length > 0){
        obj[key] = {$in: value};
    }
    else if(value && typeof value === "string" && value.length > 0){
        obj[key] = value;
    }

    _.extend(queryRef, obj);
}

function buildQuery(nodes, types, filters){
    var query = {};

    buildCollection("node._id", nodes, query);
    buildCollection("type", types, query);
    filterFactory.createQuery(filters, query);

    return query;
}

content.query = function(nodes, types, filters, options){
    var qry = buildQuery(nodes, types, filters),
        deferred = q.defer();

    this.model.find(qry, this.buildIncludes({
        include: options.include,
        exclude: options.exclude
    })).lean().exec(function(err, data){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

    return deferred.promise;
};

module.exports = content;