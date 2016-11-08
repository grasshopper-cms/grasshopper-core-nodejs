/* jshint maxdepth: 5, onevar: false */
module.exports = function (connection) {
    'use strict';
    /*jslint node: true */

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        q = require('q'),
        async = require('async'),
        schemaNode = require('./schemas/node'),
        schemaContent = require('./schemas/content'),
        nodeModel = connection.model('nodes', schemaNode),
        contentModel = connection.model('content', schemaContent),
        ObjectId = mongoose.Types.ObjectId;

    function _getAncestors(id, next) {
        var ancestors = [];

        if (id !== null && id !== '') {
            nodeModel.findById(id.toString(), function (err, doc) {
                if (doc && doc.ancestors) {
                    _.each(doc.ancestors, function (item) {
                        ancestors.push(item._id);
                    });
                }
                ancestors.push(id);

                next(null, ancestors);
            });
        }
        else {
            next(null, ancestors);
        }
    }

    function _getAncestorsFromImmediateParent(id, parent, next) {
        if (parent) {
            var ancestors = [];

            _.each(parent.ancestors, function (item) {
                ancestors.push(new ObjectId(item.id));
            });
            ancestors.push(id);
            next(null, ancestors);
        }
        else {
            _getAncestors(id, next);
        }
    }

    function _moveContent(destId, dataContentEntries, dataNodeEntries, deferred) {
        async.parallel([
                function updateContentEntries(next) {
                    async.each(dataContentEntries, function (item, next) {
                        item.meta.node = destId;
                        item.save(function (err, result, numberAffected) {
                            next(err);
                        });
                    }, function (err) {
                        next(err);
                    });
                },
                function updateNodeEntries(next) {
                    async.each(dataNodeEntries, function (item, next) {
                        item.parent = destId;

                        async.waterfall([
                            async.apply(_getAncestors, destId),
                            function (newAncestors, next) {
                                var oldAncestors = item.ancestors;
                                item.ancestors = newAncestors;
                                item.save(function (err, result, numberAffected) {
                                    _updateSiblingsAncestors(item, oldAncestors, newAncestors, next);
                                });
                            }
                        ], function (err) {
                            next(err);
                        });

                    }, function (err) {
                        next(err);
                    });
                }
            ],
            function (err, data) {
                if (err) {
                    deferred.reject({message: err});
                }
                else {
                    deferred.resolve({updated: {nodes: dataNodeEntries, content: dataContentEntries}});
                }
            });
    }

    function _updateSiblingsAncestors(item, oldAncestors, newAncestors, next) {
        nodeModel.find({ancestors: item._id}, function (err, docs) {
            async.each(docs, function (doc, next) {
                    var docAncestorsStr = "," + (doc.ancestors || []).join(",") + ","; // should get that: ,1,6,8,9,
                    var oldAncestorsStr = "," + oldAncestors.join(",") + ",";
                    var newAncestorsStr = "," + newAncestors.join(",") + ",";
                    docAncestorsStr.replace(oldAncestorsStr, newAncestorsStr);
                    var docNewAncestors = docAncestorsStr.substring(1, docAncestorsStr.length - 1).split(",");
                    doc.ancestors = docNewAncestors;
                    doc.update();
                    next();
                },
                function (err) {
                    next(err);
                });
        });
    }

    function _copyContent(destId, dataContentEntries, dataNodeEntries, deferred) {
        var pendingInsertNodes = [], pendingInsertContent = [];
        /* This function needs access to pending* vars */
        var _recursiveCopyNodes = function (src, destId, next, parent) {
            var oldId = src.id;
            src.parent = destId;

            async.waterfall([
                async.apply(_getAncestorsFromImmediateParent, destId, parent),
                function saveNodesAncestors(newAncestors, next) {
                    src.ancestors = newAncestors;
                    src._id = new ObjectId();
                    pendingInsertNodes.push(src);
                    async.parallel([
                            function findContentEntries(next) {
                                contentModel.find({"meta.node": oldId}).exec(function (err, data) {
                                    if (err) {
                                        next(err);
                                    }
                                    else {
                                        next(null, data);
                                    }
                                });
                            },
                            function findNodeEntries(next) {
                                nodeModel.find({parent: oldId}).exec(function (err, data) {
                                    if (err) {
                                        next(err);
                                    }
                                    else {
                                        next(null, data);
                                    }
                                });
                            }
                        ],
                        function handleFoundContentAndNodes(err, data) {
                            var contentEntries = data[0], nodeEntries = data[1];
                            _.each(contentEntries, function (item) {
                                item.meta.node = src._id;
                                item._id = new ObjectId();
                                pendingInsertContent.push(item);
                            });
                            if (!nodeEntries.length) {
                                next();
                            }
                            else {
                                async.each(nodeEntries, function (item, next) {
                                    _recursiveCopyNodes(item, src._id, next, src);
                                }, function (err) {
                                    next(err);
                                });
                            }
                        });

                }
            ], function (err) {
                next(err);
            });
        };

        _.each(dataContentEntries, function (item) {
            item.meta.node = destId;
            item._id = new ObjectId();
            item = _addCopyTime(item);
            pendingInsertContent.push(item);
        });

        async.each(dataNodeEntries, function (item, next) {
            _recursiveCopyNodes(item, destId !== null ? destId.toString() : null, next);
        }, function (err) {
            if (!err) {
                async.parallel([
                    function bulkSaveContent(next) {
                        contentModel.create(pendingInsertContent, function (err, result) {
                            next(err, result);
                        });
                    },
                    function bulkSaveNodesAndSetAncestors(next) {
                        nodeModel.create(pendingInsertNodes, function (err, result) {
                            next(err, result);
                        });
                    }
                ], function (err, data) {
                    if (!err) {
                        deferred.resolve({updated: {nodes: pendingInsertNodes, content: pendingInsertContent}});
                    }
                    else {
                        deferred.reject({message: err});
                    }
                });
            } else {
                deferred.reject({message: err});
            }
        });
    }

    function _addCopyTime(item) {
        var labelfield = item.meta.labelfield,
            labelValue = item.fields[labelfield];
        if (_.isString(labelValue)) {
            item.fields[labelfield] = labelValue + ' - Copy: ' + new Date();
        }
        return item;
    }

    function move(op, from, to) {
        var deferred = q.defer(), self = this;

        function processDestExist(destination) {
            var contentInputIds = _.pluck(_.where(from, {type: 'content'}) || [], "id"),
                nodeInputIds = _.pluck(_.where(from, {type: 'node'}) || [], "id"),
                destinationIds = destination ? destination._id : null;
            if (destination === null && contentInputIds.length > 0) {
                deferred.reject({message: "Cannot move content to root. Content should always be in nodes."});
            }
            else {
                async.parallel([
                        function getDataContentEntries(next) {
                            if (contentInputIds.length) {
                                contentModel.find({_id: { $in: contentInputIds }}).exec(function (err, data) {
                                    if (err) {
                                        next(err);
                                    }
                                    else {
                                        next(null, data);
                                    }
                                });
                            } else {
                                next(null, []);
                            }
                        },
                        function getDataNodeEntries(next) {
                            if (nodeInputIds.length) {
                                nodeModel.find({_id: { $in: nodeInputIds }}).exec(function (err, data) {
                                    if (err) {
                                        next(err);
                                    }
                                    else {
                                        next(null, data);
                                    }
                                });
                            } else {
                                next(null, []);
                            }

                        }
                    ],
                    function gotDataEntries(err, data) {
                        if (err) {
                            deferred.reject({message: err});
                            return;
                        }

                        var dataContentEntries = data[0], dataNodeEntries = data[1];
                        if (op === "move") {
                            if (destination) {

                                var ancestorIds = _.map(destination.ancestors, function (it) {
                                    return new ObjectId(it.id).toString();
                                });

                                var intersection = _.intersection(ancestorIds, nodeInputIds);
                                if (intersection.length || _.contains(nodeInputIds, destination.id)) {
                                    deferred.reject({message: "Cannot move a folder into itself."});
                                }
                                else {
                                    _moveContent(destinationIds, dataContentEntries, dataNodeEntries, deferred);
                                }

                            }
                            else {
                                _moveContent(destinationIds, dataContentEntries, dataNodeEntries, deferred);
                            }
                        }
                        else if (op === "copy") {
                            _copyContent(destinationIds, dataContentEntries, dataNodeEntries, deferred);
                        }
                        else {
                            deferred.reject({message: "Unknown operation: " + op + ". Only move and copy are allowed."});
                        }

                    });
            }
        }

        if (to === "0") {
            processDestExist(null);
        } else {
            nodeModel.findById(to.toString(), function (err, toData) {
                if (err) {
                    deferred.reject({message: err});
                }
                else {
                    processDestExist(toData);
                }
            });
        }
        return deferred.promise;
    }

    return {
        'move': move
    };
};
