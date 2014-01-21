'use strict';

module.exports = function getUserByEmail(kontx, next) {
    var db = require('../../db');

    db.users.getByEmail(kontx.email)
        .then(function(response){
            kontx.payload = response;
            next();
        })
        .fail(function(err){
            next(err);
        })
        .done();
};