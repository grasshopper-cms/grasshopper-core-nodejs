/**
 * User authentication model will authenticate the username and password in your database. If they are matching
 * then an auth token is created and returned. This token should be used for the remainer of your requests.
 * @param username
 * @param password
 * @returns {Promise<T>}
 */
module.exports = function(username, password){
    'use strict';

    var db = require('../db'),
        uuid  = require('node-uuid'),
        q = require('q'),
        deferred = q.defer();

    db.users.authenticate(username, password)
        .then(function(user){
            var t = uuid.v4();

            db.tokens.create({
                _id: t,
                uid: user._id,
                created: new Date().toISOString()
            }).then(function(){

                deferred.resolve(t);
            });
        })
        .fail(function(err){
            deferred.reject(err);
        });

    return deferred.promise;
};