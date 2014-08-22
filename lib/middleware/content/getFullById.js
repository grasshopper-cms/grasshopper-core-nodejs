/*jshint maxdepth:10 */
'use strict';

var db = require('../../db'),
    _ = require('lodash'),
    Q = require('q');

/**
 * Module used for pre-loading a content object and keeping it in the context to be evaluated later.
 * This exists so that we don't have to make mulitple calls to the database if we are going to be
 * performing some form of validation.
 * @param kontx
 * @param next
 */
module.exports = function setTempContent(kontx, next){

    var content = kontx._content;
    getReferences(0, content, next);
};

var x = {
    fields : {
        ref : '123',
        multi : ['123', '123'],
        embeded : {
            refN : '123',
            multiN : ['123', '123']
        }
    }
};

function getReferences(pending, content, next) {

    var maybeMongodId = /^[0-9a-fA-F]{24}$/;

    _.each(content.fields, function(value, key) {

        if (_.isArray(value)) {
            _.each(value, function(arrayValue, index) {

                if (maybeMongodId.test(arrayValue)) {

                    ++pending;
                    db.content
                        .getById(arrayValue)
                        .then(function(response) {
                            content.fields[key][index] = response.fields;
                            --pending;
                            getReferences(pending, response, next);
                        });
                }

            });
        } else if (_.isString(value) && maybeMongodId.test(value)) {

            ++pending;
            db.content
                .getById(value)
                .then(function(response) {
                    content.fields[key] = response.fields;
                    --pending;
                    getReferences(pending, response, next);
                });
        }
    });

    if (0 === pending) {
        next();
    }
}
