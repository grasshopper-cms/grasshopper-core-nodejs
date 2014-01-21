'use strict';

module.exports = function getUserByEmail(kontx, next) {
    var db = require('../../db');

    db.users.getByEmail(kontx.email)
        .then(function(user){
            kontx.payload = user;
            next();
        })
        .fail(function(err){
            next(err);
        })
        .done();
};