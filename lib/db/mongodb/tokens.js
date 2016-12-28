module.exports = function(connection){
    'use strict';

    var collectionName = 'tokens',
        q = require('q'),
        schema = require('./schemas/token'),
        crud = require('./mixins/crud'),
        token = Object.create(crud);

    token.model = connection.model(collectionName, schema);

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

    token.deleteByUserIdAndType = function(id, type) {
        var deferred = q.defer();

        this.model.remove({uid: id, type: type}, function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    token.findByUserId = function(id) {
        var deferred = q.defer();

        this.model.find({ uid: id}, function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    return token;
};
