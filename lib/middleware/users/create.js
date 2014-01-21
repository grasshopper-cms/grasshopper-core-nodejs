'use strict';

module.exports = function create(kontx, next) {
    var db = require('../../db');
console.log('test');
    db.users.create(kontx.args.user)
        .then(function(response){
            kontx.payload = response;
            next();
        })
        .fail(function(err){
            next(err);
        })
        .done();
};