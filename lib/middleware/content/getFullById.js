'use strict';

var db = require('../../db'),
    _ = require('lodash');

/**
 * Module used for pre-loading a content object and keeping it in the context to be evaluated later.
 * This exists so that we don't have to make mulitple calls to the database if we are going to be
 * performing some form of validation.
 * @param kontx
 * @param next
 */
module.exports = function setTempContent(kontx, next){

    var content = kontx._content,
        maybeMongodId = /^[0-9a-fA-F]{24}$/;

    _.each(content.fields, function(key, value) {
        if (maybeMongodId.test(value)) {
            console.log('get ' + value);
            db.content
                .getById(value)
                .then(function(response) {
                    content[key] = response.fields;
                    next();
                })
                .fail(next);
        }
    });
};