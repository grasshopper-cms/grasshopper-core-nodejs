module.exports = function(username, password){
    'use strict';

    var async = require('async'),
        users = require('../entities/users'),
        tokens = require('../entities/tokens'),
        uuid  = require('node-uuid'),
        q = require('q'),
        deferred = q.defer();

    users.authenticate(username, password)
        .then(function(user){
            var t = uuid.v4();

            tokens.create(t, user).then(function(){
                deferred.resolve(t);
            });
        })
        .fail(function(err){
            deferred.reject(err);
        });

    return deferred.promise;
};