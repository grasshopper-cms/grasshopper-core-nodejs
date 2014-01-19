module.exports = function(username, password){
    'use strict';

    var async = require('async'),
        users = require('../entities/users'),
        tokens = require('../entities/tokens'),
        uuid  = require('node-uuid'),
        q = require('q'),
        deferred = q.defer();


    async.waterfall([
        function(userName, password, next){
            users.authenticate(userName, password)
                .then(function(user){
                    next(null, user);
                })
                .fail(function(err){
                    next(err);
                });
        },
        function(user, next){
            var t = uuid.v4();
            tokens.create(t, user)
                .then(function(){
                    next(null, t);
                });
        }],
        function(err, accessToken){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(accessToken);
            }
        }
    );

    return deferred.promise;
};