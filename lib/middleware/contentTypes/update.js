module.exports = function update (kontx, next) {
    'use strict';

    var async = require('async'),
        _ = require('lodash'),
        db = require('../../db')(),
        Strings = require('../../strings'),
        error = require('../../utils/error'),
        messages = new Strings('en').group('errors'),
        Q = require('q'),
        idsHaveChanged = false,
        changedIds = {
            contentTypeId: kontx.args._id,
            typesThatEmbedThisChangedType : []
        },
        originalChanges = [],
        newChangedContentType = kontx.args;

    async.waterfall([
        function (cb) {
            db.contentTypes.getById(newChangedContentType._id).then(
                function (payload) {
                    cb(null, payload);
                },
                function (err) {
                    cb(err);
                }
            );
        },
        function (originalType, cb) {
            _.each(originalType.fields, function(originalContentTypeField) {

                var newContentTypeField = _.find(newChangedContentType.fields, function (newField) {
                    return newField._uid == originalContentTypeField._uid;
                });

                if (newContentTypeField && originalContentTypeField._id.toString() !== newContentTypeField._id.toString()) {
                    idsHaveChanged = true;

                    originalChanges.push({
                        find : originalContentTypeField._id,
                        change : newContentTypeField._id
                    });
                }
            });

            cb();
        },
        function (cb) {
            db.contentTypes.update(newChangedContentType).then(
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
                updateContentIds().then(
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

    function updateContentIds() {
        return Q.allSettled([updateRootContentIds(), updateEmbeddedContentIds(changedIds.contentTypeId.toString(), originalChanges)]);
    }

    function updateRootContentIds() {
        var modifiedFields = {};

        originalChanges.forEach(function(change) {
            modifiedFields['fields.'+ change.find] = 'fields.'+ change.change;
        });

        return db.content.updateIdsByMeta(String(changedIds.contentTypeId).valueOf(), modifiedFields);
    }

    function updateEmbeddedContentIds(typeId, changes) {
        return db.contentTypes.findTypesThatEmbedThisTypeById(typeId)
            .then(function(contentTypes) {
                return Q.allSettled(contentTypes.map(function(contentType) {
                    var modifiedFields = {},
                        thisTypesKeyPath = _.findWhere(contentType.fields, { options : typeId })._id;

                    changes.forEach(function(change) {
                        modifiedFields['fields.'+ thisTypesKeyPath +'.'+ change.find] = 'fields.'+ thisTypesKeyPath +'.'+ change.change;
                    });

                    return db.content.updateIdsByMeta(String(contentType._id).valueOf(), modifiedFields)
                        .then(function() {
                            return updateEmbeddedContentIds(String(contentType._id).valueOf(), changes.map(function(changeItem) {
                                return {
                                    find : thisTypesKeyPath +'.'+ changeItem.find,
                                    change : thisTypesKeyPath +'.'+ changeItem.change
                                };
                            }));
                        });
                }));
            });
    }
};

