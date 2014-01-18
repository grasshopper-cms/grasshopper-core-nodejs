"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    q = require('q'),
    collectionName = "tokens",
    schema = require('./schemas/token');

var token = Object.create(crud,
    {model: {value: mongoose.model(collectionName, schema)}}
);


token.deleteByUserId = function(id) {
    var deferred = q.defer();

    this.model.remove({ uid: id }, function(err, data){
        if(err){
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

module.exports = token;
