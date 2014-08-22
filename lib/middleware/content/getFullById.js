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

    var content = kontx._content,
        promises = [],
        counter = 0;

    console.log('first');
    try {
        getReferences(content, next);

    } catch(e) {
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log('---');
        console.log(e);
    }

    function getReferences(content, next) {

        var maybeMongodId = /^[0-9a-fA-F]{24}$/,
            i;

        console.log('in', i = ++counter);
        _.each(content.fields, function(value, key) {

            if (_.isArray(value)) {
                _.each(value, function(arrayValue, index) {

                    if (_.isObject(arrayValue)) {
                        getReferences({
                            fields : arrayValue
                        }, next);
                    } else if (maybeMongodId.test(arrayValue)) {

                        promises.push(db.content
                            .getById(arrayValue)
                            .then(function(response) {
                                content.fields[key][index] = response.fields;
                                getReferences(response, next);
                            }));
                    }

                });
            } else if (maybeMongodId.test(value)) {

                promises.push(db.content
                    .getById(value)
                    .then(function(response) {
                        content.fields[key] = response.fields;
                        getReferences(response, next);
                    }));
            }
        });

        tryToSendResponse(i);
        console.log('out',i);
    }

    function tryToSendResponse(i) {

        if (6 === i || _.every(promises, function(promise) { promise.isFulfilled(); })) {
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log('\n\n\n\n000000000000000000');
            console.log(JSON.stringify(kontx._content,null,4));
            next();
        }
    }
};
