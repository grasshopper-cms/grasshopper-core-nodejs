module.exports = (function(){
    'use strict';
    /*jslint node: true */

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        q = require('q'),
        async = require('async'),
        crud = require('./mixins/crud'),
        filterFactory = require('./search/filterFactory'),
        objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$"),
        collectionName = 'nodes',
        schema = require('./schemas/node'),
        schemaContent = require('./schemas/content'),
        nodeModel = mongoose.model(collectionName, schema),
        node = Object.create(crud,
            {model: {value: nodeModel}}
        ),
        contentModel = mongoose.model('content', schemaContent),
        ObjectId = mongoose.Types.ObjectId;

    /**
     * Function will look at the id that has been passed to the module and
     * if it is a string send it back, if it is an object with an `id` property
     * then it will check to see if it is a valid mongo objectid format and then
     * send it back.
     * @param id
     * @returns {*}
     */
    function getId(id){
        if(_.isObject(id) && !_.isUndefined(id.id)){
            if (objectIdRegex.test(id.id)) {
                id = id.id;
            }
            else {
                id = null;
            }
        }
        return id;
    }

    function handleNode(err, doc, deferred){

        if(err) {
            deferred.reject(err);
        }
        else if (doc !== null) {
            deferred.resolve(doc);
        }
        else {
            deferred.resolve(new Error('Node does not exist'));
        }
    }

    function getAncestors(id, next){
        var ancestors = [];

        if(id !== null && id !== ''){
            node.getById(id.toString())
                .then(function(doc){
                    if(doc && doc.ancestors){
                        _.each(doc.ancestors, function(item){
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

    function getAncestorsFromImmediateParent(id, parent, next) {
        if (parent) {
            var ancestors = [];

            _.each(parent.ancestors, function (item) {
                ancestors.push(new ObjectId(item.id));
            });
            ancestors.push(id);
            next(null, ancestors);
        }
        else {
            getAncestors(id, next);
        }
    }



    node.insert = function(obj){
        var self = this,
            deferred = q.defer();

        function create(ancestors, next){
            obj.ancestors = ancestors;

            self.model.create(obj, function(err, doc){
                if(err) {
                    deferred.reject(self.handleError(err));
                    return;
                }

                self.getById(doc._id.toString())
                    .then(function(cleanObj){
                        next(null, cleanObj);
                    })
                    .fail(function(err){
                        next(err);
                    });
            });
        }


        function done(err, results){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        }

        async.waterfall([
            async.apply(getAncestors, obj.parent),
            function(ancestors, next){ create(ancestors, next ); }
        ],done);

        return deferred.promise;
    };

    node.update = function(obj){
        var self = this,
            deferred = q.defer();

        function update(ancestors, next){
            var primaryKey = _.extend({}, obj)._id;
            delete obj._id;
            obj.ancestors = ancestors;

            self.model.findById(primaryKey, function(err, doc) {
                if(err) {  next(self.handleError(err)); return; }
                if(!doc) { next(new Error('Document does not exist.')); return; }

                _.each(_.keys(obj), function(key){
                    try{
                        doc[key] = obj[key];
                    }
                    catch(ex){
                        console.log(ex);
                    }
                });

                doc.save(function(err){
                    if(err){  next(self.handleError(err)); return; }

                    self.getById(primaryKey.toString()).then(function(cleanObj){
                        next(null, cleanObj);
                    })
                        .fail(function(err){
                            next(err);
                        });
                });
            });
        }

        function done(err, results){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        }

        async.waterfall([
            async.apply(getAncestors, obj.parent),
            function(ancestors, next){ update(ancestors, next ); }
        ],done);

        return deferred.promise;
    };

    node.getById = function(id) {
        var deferred = q.defer();
        id = getId(id);

        this.model.findById(id, this.buildIncludes())
            .populate('allowedTypes parent ancestors', '_id label helpText')
            .lean()
            .exec(function(err, doc){
                handleNode(err, doc, deferred);
            });

        return deferred.promise;
    };

    node.getByParent = function(id){
        var deferred = q.defer();

        id = getId(id);
        this.model.find(
            {parent: id}, this.buildIncludes(), {sort: {label:1}})
            .populate('allowedTypes parent ancestors', '_id label')
            .lean()
            .exec(function(err, doc){
                handleNode(err, doc, deferred);
            });

        return deferred.promise;
    };

    node.saveContentTypes = function(id, types){
        var deferred = q.defer();
        id = getId(id);
        this.model.findById(id, function(err, doc){
            if(err){
                deferred.reject(err);
                return;
            }

            doc.allowedTypes = [];
            _.each(types, function(item){
                var type = _.isString(item) ? item : item.id;
                doc.allowedTypes.addToSet(type);
            });

            doc.save(function (err) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve('Success');
                }
            });
        });

        return deferred.promise;
    };

    function _moveContent(destId, dataContentEntries, dataNodeEntries, deferred) {
        async.parallel([
                function updateContentEntries(callback) {
                    async.each(dataContentEntries, function (item, callback) {
                        item.meta.node = destId;
                        item.save(function (err, result, numberAffected) {
                            callback(err);
                        });
                    }, function (err) {
                        callback(err);
                    });
                },
                function updateNodeEntries(callback) {
                    async.each(dataNodeEntries, function (item, callback) {
                        item.parent = destId;

                        async.waterfall([
                            async.apply(getAncestors, destId),
                            function (newAncestors, callback) {
                                var oldAncestors = item.ancestors;
                                item.ancestors = newAncestors;
                                item.save(function (err, result, numberAffected) {
                                    _updateSiblingsAncestors(item, oldAncestors, newAncestors, callback);
                                });
                            }
                        ], function (err) {
                            callback(err);
                        });

                    }, function (err) {
                        callback(err);
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


    var _updateSiblingsAncestors = function (item, oldAncestors, newAncestors, callback) {
        nodeModel.find({ancestors: item._id}, function (err, docs) {
            async.each(docs, function (doc, callback) {
                    var docAncestorsStr = "," + (doc.ancestors || []).join(",") + ","; // should get that: ,1,6,8,9,
                    var oldAncestorsStr = "," + oldAncestors.join(",") + ",";
                    var newAncestorsStr = "," + newAncestors.join(",") + ",";
                    docAncestorsStr.replace(oldAncestorsStr, newAncestorsStr);
                    var docNewAncestors = docAncestorsStr.substring(1, docAncestorsStr.length - 2).split(",");
                    doc.ancestors = docNewAncestors;
                    doc.update();
                    callback();
                },
                function (err) {
                    callback(err);
                });
        });
    };

    function _copyContent(destId, dataContentEntries, dataNodeEntries, deferred) {
        var pendingInsertNodes = [], pendingInsertContent = [];
        /* This function needs access to pending* vars */
        var _recursiveCopyNodes = function (src, destId, callback, parent) {
            var oldId = src.id;
            src.parent = destId;


            async.waterfall([
                async.apply(getAncestorsFromImmediateParent, destId, parent),
                function saveNodesAncestors(newAncestors, callback) {
                    src.ancestors = newAncestors;
                    src._id = new ObjectId();
                    pendingInsertNodes.push(src);
                    async.parallel([
                            function findContentEntries(callback) {
                                contentModel.find({"meta.node": oldId}).exec(function (err, data) {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null, data);
                                    }
                                });
                            },
                            function findNodeEntries(callback) {
                                nodeModel.find({parent: oldId}).exec(function (err, data) {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null, data);
                                    }
                                })
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
                                callback()
                            }
                            else {
                                async.each(nodeEntries, function (item, callback) {
                                    _recursiveCopyNodes(item, src._id, callback, src);
                                }, function (err) {
                                    callback(err);
                                });
                            }
                        })

                }
            ], function (err) {
                callback(err);
            })
        };

        _.each(dataContentEntries, function (item) {
            item.meta.node = destId;
            item._id = new ObjectId();
            pendingInsertContent.push(item);
        });

        async.each(dataNodeEntries, function (item, callback) {
            _recursiveCopyNodes(item, destId !== null ? destId.toString() : null, callback);
        }, function (err) {
            if (!err) {
                async.parallel([
                    function bulkSaveContent(callback) {
                        contentModel.create(pendingInsertContent, function (err, result) {
                            callback(err, result);
                        });
                    },
                    function bulkSaveNodesAndSetAncestors(callback) {
                        nodeModel.create(pendingInsertNodes, function (err, result) {
                            callback(err, result);
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

    node.move = function (op, from, to) {
        var deferred = q.defer(), self = this;

        function processDestExist(toId) {
            var contentInputIds = _.pluck(_.where(from, {type: 'content'}) || [], "id"),
                nodeInputIds = _.pluck(_.where(from, {type: 'node'}) || [], "id");
            if (toId === null && contentInputIds.length > 0) {
                deferred.reject({message: "Cannot move content to root. Content should always be in nodes."});
            }
            else {
                async.parallel([
                        function getDataContentEntries(callback) {
                            if (contentInputIds.length) {
                                contentModel.find({_id: { $in: contentInputIds }}).exec(function (err, data) {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null, data);
                                    }
                                });
                            } else {
                                callback(null, []);
                            }
                        },
                        function getDataNodeEntries(callback) {
                            if (nodeInputIds.length) {
                                nodeModel.find({_id: { $in: nodeInputIds }}).exec(function (err, data) {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null, data);
                                    }
                                });
                            } else {
                                callback(null, []);
                            }

                        }
                    ],
                    function gotDataEntries(err, data) {
                        if (err) {
                            deferred.reject({message: err});
                        }
                        else {
                            var dataContentEntries = data[0], dataNodeEntries = data[1];
                            if (op === "move") {
                                if (toId !== "0") {
                                    nodeModel.findById(toId, function (err, doc) {
                                        var ancestorIds = _.map(doc.ancestors, function (it) {
                                            return new ObjectId(it.id).toString()
                                        });
                                        var intersection = _.intersection(ancestorIds, nodeInputIds);
                                        if (intersection.length || _.contains(nodeInputIds, new ObjectId(toId).toString())) {
                                            deferred.reject({message: "Cannot move a folder into itself."});
                                        }
                                        else {
                                            _moveContent(toId, dataContentEntries, dataNodeEntries, deferred);
                                        }
                                    })
                                }
                                else {
                                    _moveContent(toId, dataContentEntries, dataNodeEntries, deferred);
                                }
                            }
                            else if (op === "copy") {
                                _copyContent(toId, dataContentEntries, dataNodeEntries, deferred);
                            }
                            else {
                                deferred.reject({message: "Unknown operation: " + op + ". Only move and copy are allowed."});
                            }
                        }
                    });
            }
        }

        if (to === "0") {
            processDestExist(null);
        } else {
            self.model.findById(to.toString(), function (err, toData) {
                if (err) {
                    deferred.reject({message: err});
                }
                else {
                    processDestExist(toData._id);
                }
            });
        }
        return deferred.promise;
    };

    node.query = function(filters, options){
        var qry = {},
            deferred = q.defer(),
            self = this;

        filterFactory.createQuery(filters, qry);

        async.parallel(
            [
                function(cb){
                    self.model.find(qry, self.buildIncludes(options)).lean().exec(function(err, data){
                        if(err){
                            cb(err);
                        } else {
                            cb(null, data);
                        }
                    });
                },
                function(cb){
                    self.model.count(qry).lean().exec(function (err, data) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            cb(null, data);
                        }
                    });
                }
            ],function(err, results){
                var result;

                if(err){
                    deferred.reject(err);
                }
                else {

                    result = {
                        total: _.isUndefined(results[1]) ? 0 : results[1],
                        limit: options.limit,
                        skip: options.skip,
                        results: results[0]
                    };

                    deferred.resolve(result);
                }
            }
        );

        return deferred.promise;
    };

    return node;
})();