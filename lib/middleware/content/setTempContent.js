/**
 * Module used for pre-loading a content object and keeping it in the context to be evaluated later.
 * This exists so that we don't have to make mulitple calls to the database if we are going to be
 * performing some form of validation.
 * @param kontx
 * @param next
 */
module.exports = function setTempContent(kontx, next){
    'use strict';

    var db = require('../../db');

    db.content.getById(kontx.args.id).then(
        function(content){
            kontx._content = content;
            next();
        },
        function(err){
            next(err);
        }
    ).done();
};