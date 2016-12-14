/*jshint maxdepth:10 */
'use strict';

var db = require('../../db')(),
    _ = require('lodash'),
    BB = require('bluebird'),
    maybeMongodId = /^[0-9a-fA-F]{24}$/,
    logger = require('../../utils/logger');

/**
 * Module used for populating content references.
 * This is basically a deep recursive mongoose populate call on all paths.
 *    the mongoose call doesn't seem to be recursive. You should cache these results for as long as possible.
 * @param kontx
 * @param next
 */
module.exports = function (kontx, next){

    var content = kontx._content;

    BB
        .try(function() {
            return fetchReferencesFromContent(content);
        })
        .then(function() {
            next();
        })
        .catch(function(error) {
            logger.error('Query all error');
            logger.error(error);
        });
};

function fetchReferencesFromContent(content) {
    if (content.results && _.isArray(content.results)) {
        if (content.results.length) {
            return BB.all(_.map(content.results, function(result) {
                return getReferences(result.fields, []);
            }));
        } else {
            // if there are no results, there is nothing to do
            return;
        }
    } else {
        return getReferences(content.fields, []);
    }
}

function getReferences(fields) {

    return BB
        .all(_
            .chain(fields)
            .map(function(value, key) {
                return [
                    getArrayReferences(fields, value, key),
                    getDirectReferences(fields, value, key),
                    getObjectReferences(fields, value, key)
                ];
            })
            .flatten()
            .value());
}

function getObjectReferences(fields, value, key) {
    if (!_.isObject(value)) {
        return;
    }
    return BB.all(_.map(value, function(v, k) {
        if (_.isString(v)) {
            return getDirectReferences(value, v, k);
        } else {
            return getReferences(v);
        }
    }));
}

function getDirectReferences(fields, value, key) {
    var query;

    if (!_.isString(value)) {
        return;
    }

    if (maybeMongodId.test(value)) {

        query = db.content.getById(value);

        return BB
            .resolve(query.then(function(response) {
                fields[key] = response.fields;
                return getReferences(response.fields);
            }))
            .catch(function() {
                // if something goes wrong, leave the reference untouched
                logger.error('Query Full: could not find - ' + value);
            });
    }
}

function getArrayReferences(parent, array, key) {
    if (!_.isArray(array)) {
        return;
    }

    return BB.all(_.map(array, function(item, index) {
        var query;
        if (maybeMongodId.test(item)) {

            query = db.content.getById(item);

            return BB
                .resolve(query.then(function(response) {
                    parent[key][index] = response.fields;
                    return getReferences(response.fields);
                }))
                .catch(function() {
                    // if something goes wrong, leave the reference untouched
                    logger.error('Query Full: could not find - ' + item);
                });
        }
    }));
}
