/*jshint maxdepth:10 */
'use strict';

var db = require('../../db'),
    _ = require('lodash'),
    Q = require('q'),
    maybeMongodId = /^[0-9a-fA-F]{24}$/;

/**
 * Module used for populating content references.
 * This is basically a deep recursive mongoose populate call on all paths.
 * @param kontx
 * @param next
 */
module.exports = function (kontx, next){

    var content = kontx._content;

    // If we have an array, next must be called array.length times before getReferences(content.fields, promises, next, kontx);actually moving on to the next middleware
    if (content.results && _.isArray(content.results)) {
        if (content.results.length) {
            next = _.after(content.results.length, next);
            _.each(content.results, function(result) {
                getReferences(result.fields, [], next, kontx);
            });
        } else {
            // if there are no results, there is nothing to do
            next();
        }
    } else {
        getReferences(content.fields, [], next, kontx);
    }

};

function getReferences(fields, promises, next, kontx) {

    _.each(fields, function(value, key) {
        getArrayReferences(fields, value, key, promises, next, kontx);
        getDirectReferences(fields, value, key, promises, next, kontx);
        getObjectReferences(fields, value, key, promises, next, kontx);
    });

    process.nextTick(function() {
        tryToSendResponse(promises, next);
    });
}

function getObjectReferences(fields, value, key, promises, next, kontx) {
    _.each(value, function(v, k) {
        if (_.isString(v)) {
            getDirectReferences(value, v, k, promises, next, kontx);
        } else {
            getReferences(v, promises, next, kontx);
        }
    });
}

function getDirectReferences(fields, value, key, promises, next, kontx) {
    var query;

    if (!_.isString(value)) {
        return;
    }

    if (maybeMongodId.test(value)) {

        query = db.content.getById(value);
        promises.push(query);

        query.then(function(response) {
            fields[key] = response.fields;
            getReferences(response.fields, promises, next, kontx);
        })
            .catch(function(e) {console.log(e); });
    }
}

function getArrayReferences(parent, array, key, promises, next, kontx) {
    if (!_.isArray(array)) {
        return;
    }

    _.each(array, function(item, index) {
        var query;
        if (maybeMongodId.test(item)) {

            query = db.content.getById(item);
            promises.push(query);

            query.then(function(response) {
                parent[key][index] = response.fields;
                getReferences(response.fields, promises, next, kontx);
            })
                .catch(function(e) {console.log(e); });
        }
    });
}

function tryToSendResponse(promises, next) {
    var count = 0;
    _.each(promises, function(promise) {
        if (promise.isFulfilled()) {
            ++count;
        }
    });
    if (_.every(promises, function(promise) { return promise.isFulfilled(); })) {
        next();
    }
}
