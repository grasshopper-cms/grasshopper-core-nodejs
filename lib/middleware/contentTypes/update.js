module.exports = function update (kontx, next) {
    'use strict';

    var async = require('async'),
        _ = require('lodash'),
        db = require('../../db'),
        Strings = require('../../strings'),
        error = require('../../utils/error'),
        messages = new Strings('en').group('errors'),
        q = require('q'),
        idsHaveChanged = false,
        changedIds = {
            contentTypeId: kontx.args._id,
            baseChanges: {}
        };

    async.waterfall([
        function (cb) {
            db.contentTypes.getById(kontx.args._id).then(
                function (payload) {
                    cb(null, payload);
                },
                function (err) {
                    cb(err);
                }
            );
        },
        function (originalType, cb) {
            changedIds.baseChanges[kontx.args._id] = [];
            _.each(originalType.fields, function (field) {
                var newId = _.find(kontx.args.fields, function (newField) {
                    return newField._uid == field._uid;
                });

                if (newId && field._id != newId._id) {
                    idsHaveChanged = true;

                    changedIds.baseChanges[kontx.args._id].push({
                        find: field._id,
                        change: newId._id,
                        contentTypeId: kontx.args._id
                    });
                }
            });

            cb();
        },
        function (cb) {
            db.contentTypes.update(kontx.args).then(
                function (payload) {
                    cb(null, payload);
                },
                function (err) {
                    cb(err);
                }
            );
        },
        function (typeobj, cb) {
            if (idsHaveChanged) {
                updateContentIds(changedIds).then(
                    function (payload) {
                        cb(null, typeobj);
                    },
                    function (err) {
                        cb(err);
                    }
                );
            } else {
                cb(null, typeobj);
            }
        },
        function (typeobj, cb) {
            var id = typeobj._id,
                firstField = _.first(typeobj.fields);

            if (_.isUndefined(firstField)) {
                cb(error(404, messages.types_empty_fields));
            }
            else {
                db.content.updateLabelField(id.toString(), firstField._id).then(
                    function (payload) {
                        cb(null, typeobj);
                    },
                    function (err) {
                        cb(err);
                    }
                );
            }
        }
    ], function (err, results) {

        if (err) {
            next(err);
            return;
        }
        kontx.payload = results;
        next();
    });

    function updateContentIds (changedIdsObject) {
        var mainDeferred = q.defer(),
            originalContentTypeId = changedIdsObject.contentTypeId,
            contentUpdatePromises = [],
            contentTypeResultContainer = {},
            lastFieldPushid = '',
            currentContentTypeId = changedIdsObject.contentTypeId;

        contentTypeResultContainer = _.extend(contentTypeResultContainer, changedIdsObject.baseChanges);

        findEmbeds(currentContentTypeId);


        function foundContentTypesComplete () {
            _.each(contentTypeResultContainer, function (contentTypeResult, id) {
                var promise = executeChangeContent(contentTypeResult, id);
                contentUpdatePromises.push(promise);
            });

            q.all(contentUpdatePromises)
                .then(function () {
                    mainDeferred.resolve();
                });

        }

        function findEmbeds (id) {
            db.contentTypes.find({fields: {$elemMatch: {options: String(id).valueOf()}}})
                .then(function (foundTypes) {
                    if (foundTypes.length) {

                        _.each(foundTypes, function (foundType) {
                            contentTypeResultContainer[foundType._id] = [];

                            var fieldPush = _.find(foundType.fields, function (field) {
                                if (String(field.options).valueOf() == String(id).valueOf()) {
                                    return field._id;
                                }
                            });
                          
                            _.each(changedIdsObject.baseChanges[originalContentTypeId], function (originalChangeObject) {
                                contentTypeResultContainer[foundType._id].push({

                                    find: fieldPush._id + '.' + lastFieldPushid + originalChangeObject.find,
                                    change: fieldPush._id + '.' + lastFieldPushid + originalChangeObject.change,
                                    contentTypeId: foundType._id
                                });
                            });

                            lastFieldPushid = fieldPush._id + '.';
                            findEmbeds(foundType._id);
                        });

                    } else {
                        foundContentTypesComplete();
                    }

                });
        }

        function executeChangeContent (mapping, id) {
            var deferred = q.defer(),
                fieldsToUpdate = {};

            _.each(mapping, function (change) {
                var findField = 'fields.' + change.find;
                fieldsToUpdate[findField] = 'fields.' + change.change;
            });

            db.content.updateIdsByMeta(id, fieldsToUpdate)
                .then(function () {
                    deferred.resolve({result: true});
                },
                function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;
        }


        return mainDeferred.promise;
    }


};

