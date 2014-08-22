/*jshint maxdepth:10 */
'use strict';

var db = require('../../db'),
    _ = require('lodash'),
    Q = require('q'),
    maybeMongodId = /^[0-9a-fA-F]{24}$/;

/**
 * Module used for pre-loading a content object and keeping it in the context to be evaluated later.
 * This exists so that we don't have to make mulitple calls to the database if we are going to be
 * performing some form of validation.
 * @param kontx
 * @param next
 */
module.exports = function setTempContent(kontx, next){

    var content = kontx._content,
        promises = [];

    console.log('first');
    getReferences(content.fields, next);

    function getReferences(fields, next) {

        _.each(fields, function(value, key) {
            getArrayReferences(fields, value, key);
            getDirectReferences(fields, value, key);
        });

        tryToSendResponse();
    }

    function getDirectReferences(fields, value, key) {
        var query;

        if (!_.isString(value)) {
            return;
        }

        console.log('is string');
        if (maybeMongodId.test(value)) {

            query = db.content.getById(value);
            promises.push(query);

            query.then(function(response) {
                fields[key] = response.fields;
                console.log('if', query.isFulfilled());
                getReferences(response.fields, next);
            })
                .catch(function(e) {console.log(e); });
        }
    }

    function getArrayReferences(parent, array, key) {
        console.log('array',array);
        if (!_.isArray(array)) {
            return;
        }

        console.log('is array');
        _.each(array, function(item, index) {
            var query;
            if (maybeMongodId.test(item)) {

                query = db.content.getById(item);
                promises.push(query);

                query.then(function(response) {
                    parent[key][index] = response.fields;
                    console.log('if', query.isFulfilled());
                    getReferences(response.fields, next);
                })
                    .catch(function(e) {console.log(e); });
            }
        });
    }

    function tryToSendResponse(i) {
        console.log(1);
        var count = 0;
        console.log(JSON.stringify(kontx._content,null,4));
        console.log(2);
        _.each(promises, function(promise) {
            if (promise.isFulfilled()) {
                ++count;
            }
        });
        console.log(3);
        console.log('length', promises.length, 'FFF', count);
        if (_.every(promises, function(promise) { return promise.isFulfilled(); })) {
            console.log('\n\n\n\n000000000000000000');
            console.log(JSON.stringify(kontx._content,null,4));
            next();
        }
        console.log(4);
    }
};
