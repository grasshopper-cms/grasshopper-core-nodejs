
module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        crud = require('./mixins/crud'),
        q = require('q'),
        collectionName = 'contentTypes',
        schema = require('./schemas/contentType'),
        contentType = Object.create(crud,
            {model: {value: mongoose.model(collectionName, schema)}}
        );


    contentType.find = function(query) {
        var deferred = q.defer();

        this.model.find(query, function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    contentType.findTypesThatEmbedThisTypeById = function(typeId) {
        return this.model.find({ fields: { $elemMatch: { options: typeId }}});
    };

    return contentType;
})();