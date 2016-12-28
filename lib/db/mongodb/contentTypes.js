
module.exports = function(connection){
    'use strict';

    var crud = require('./mixins/crud'),
        q = require('q'),
        collectionName = 'contentTypes',
        schema = require('./schemas/contentType'),
        contentType = Object.create(crud);

    contentType.model = connection.model(collectionName, schema);

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
};
