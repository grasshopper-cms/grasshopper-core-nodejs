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

    _.each(content.fields, function(value, key) {

        if (maybeMongodId.test(value)) {
            db.content
                .getById(value)
                .then(function(response) {
                    content.fields[key] = response.fields;
                    console.log('\n\n\ncontent', JSON.stringify(content, null, 4));
                    next();
                })
                .fail(next);
        }
    });
};