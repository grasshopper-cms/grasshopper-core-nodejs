module.exports = function logout(kontx, next){
    'use strict';

    var _ = require('underscore'),
        Strings = require('../../strings'),
        db = require('../../db'),
        createError = require('../../utils/error'),
        strings = new Strings();
console.log(kontx);
    db.tokens.deleteById(kontx.token).then(
        function(payload){
            console.log(payload);
        },
        function(err){
            console.log(err);
        }
    ).done(next);
};


