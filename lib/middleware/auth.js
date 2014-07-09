module.exports = function(login, password){
    'use strict';

    var Strings = require('../strings'),
        db = require('../db'),
        strings = new Strings('en');

    return function authenticate(kontx, next){
        var err = new Error(strings.group('errors').invalid_login);
        err.code = strings.group('codes').forbidden;

        db.users.basicAuthentication(login, password)
            .then(function(user){
                kontx.user = user;
            })
            .fail(function(err){
                next(err);
            });


    };
};