module.exports = function (connection) {
    'use strict';

    var crud = require('./mixins/crud'),
        filterFactory = require('./search/filterFactory'),
        find = require('./mixins/find'),
        findDistinct = require('./mixins/findDistinct'),
        schema = require('./schemas/content'),
        _ = require('lodash'),
        async = require('async'),
        mongoose = require('mongoose'),
        q = require('q'),
        collectionName = 'content',
        content = Object.create(crud);

    content.model = connection.model(collectionName, schema);

    function buildCollection (key, value, queryRef) {
        var obj = {};

        if (value && value instanceof Array && value.length > 0) {
            obj['meta.' + key] = {$in: value};
        }
        else if (value && typeof value === 'string' && value.length > 0) {
            obj['meta.' + key] = value;
        }

        _.extend(queryRef, obj);
    }

    function buildQuery (nodes, types, filters, options, content) {
        var query = {},
            validFromKey,
            validToKey,
            rightNow,
            existingQuery,
            newQuery;

        buildCollection('node', nodes, query);
        buildCollection('type', types, query);
        filterFactory.createQuery(filters, query);

        // send in the field to the publishing window object to respect it
        if (!!options.publishingWindow) {
            validFromKey = options.publishingWindow + '.validFrom';
            validToKey = options.publishingWindow + '.validTo';
            rightNow = new Date();

            query.$and = query.$and || [];

            newQuery = {};
            newQuery[validFromKey] = {
                $lte: rightNow
            };
            query.$and.push(newQuery);

            newQuery = {};
            newQuery[validToKey] = {
                $gte: rightNow
            };
            query.$and.push(newQuery);
        }


        if (options.distinct) {
            query.run = findDistinct.bind(query, options, content);
        } else {
            query.run = find.bind(query, options, content);
        }

        return query;
    }

    function cleanMongoCollection (collection) {
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

        return _.filter(collection, function (item) {
            return checkForHexRegExp.test(item);
        });
    }

    function calculateTimeToNextPublishingWindowOpening(content) {
        return Math.min.apply(Math, _.filter(_timesToOpenArray(), function(time) {
            return time > 0;
        }));

        function _timesToOpenArray() {
            return content.results.map(function(result) {
                var publishingWindowOpening = result.fields.editorialWindow.validFrom;
                return publishingWindowOpening.getTime() - _.now();
            });
        }
    }

    content.updateLabelField = function (type, fieldname) {
        var deferred = q.defer();

        this.model.update({ 'meta.type': type }, { $set: { 'meta.labelfield': fieldname } }, { multi: true })
            .exec(function (err, data) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                deferred.resolve({result: true});
            });

        return deferred.promise;
    };

    content.updateIdsByMeta = function (contentTypeId, fieldsToUpdate) {
        var deferred = q.defer();

        this.model.db.collections.content.update({ 'meta.type': mongoose.Types.ObjectId(contentTypeId) }, { $rename: fieldsToUpdate }, { multi : true }, function(err, raw) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve({result: true});
        });

        return deferred.promise;
    };

    content.query = function (nodes, types, filters, options) {
        if (options.nextPublishingWindow) {
            var optionsWithoutPublishingWindow = _.clone(options, true);
            delete optionsWithoutPublishingWindow.publishingWindow;

            return q
                .all([
                    buildQuery(cleanMongoCollection(nodes), cleanMongoCollection(types), filters, options, this).run(),
                    buildQuery(cleanMongoCollection(nodes), cleanMongoCollection(types), filters, optionsWithoutPublishingWindow, this).run()
                ])
                .then(function(queryResults) {
                    queryResults[0].timeToNextPublishingWindowOpening = calculateTimeToNextPublishingWindowOpening(queryResults[1]);
                    return queryResults[0];
                });
        } else {
            return buildQuery(cleanMongoCollection(nodes), cleanMongoCollection(types), filters, options, this).run();
        }
    };

    return content;
};
