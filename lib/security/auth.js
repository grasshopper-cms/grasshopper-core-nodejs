/**
 * User authentication model will authenticate the username and password in your database. If they are matching
 * then an auth token is created and returned. This token should be used for the remainer of your requests.
 * @param username
 * @param password
 */
module.exports = function(username, password){
    'use strict';

    var db = require('../db'),
        uuid  = require('node-uuid'),
        q = require('q'),
        deferred = q.defer(),
        Strings = require('../strings'),
        strings = new Strings('en'),
        err = new Error(strings.group('errors').invalid_login);

    err.errorCode = strings.group('codes').unauthorized;

    db.users.authenticate(username, password).then(function(user){
            var t = uuid.v4();

            db.tokens.insert({
                _id: t,
                uid: user._id,
                created: new Date().toISOString()
            }).then(function(){
                deferred.resolve(t);
            });
        }).fail(function(){
            deferred.reject(err);
        }).done();

    return deferred.promise;
};