(function(){
    "use strict";

    var node = {},
        db = require("../db"),
        assets = require("../assets"),
        _ = require("underscore"),
        q = require("q"),
        async = require("async"),
        fs = require("fs");

    node.getById = function(id){
        return db.nodes.getById(id);
    };

    node.getBySlug = function(slug){
        return db.nodes.getBySlug(slug);
    };

    /**
     * Method that will return a list of nodes from a parent
     * @param id parent node ID. If root then it will except 0/null.
     */
    node.getChildNodes = function(id){
        return db.nodes.getByParent(id);
    };

    node.getByIdDeep = function(nodeId){
        var nodeList = [],
            deferred = q.defer();

        db.nodes.getById(nodeId)
            .then(function(parentNode){
                nodeList.push(parentNode);

                node.getChildNodesDeep(nodeId)
                    .then(function(nodes){
                        nodeList = nodeList.concat(nodes);
                        deferred.resolve(nodeList);
                    });
            })
            .fail(function(err){
               deferred.reject(err);
            });

        return deferred.promise;
    };

    /**
     * Recurrsively load node objects and also construct the children collection. This is used to build a tree of objects to traverse. The children are not parsed as part of the Query object
     * @param nodeId parent node ID. If root then it will except 0/null.
     */
    node.getChildNodesDeep = function(nodeId){
        var nodeList = [],
            deferred = q.defer();

        db.nodes.getByParent(nodeId).then(function(nodes){
            function each(child, next){
                nodeList = nodeList.concat(child);

                node.getChildNodesDeep(child._id).then(function(nodes){
                    nodeList = nodeList.concat(nodes);
                    next(null);
                })
                .fail(function(err){
                    next(err);
                });
            }

            function done(){
                deferred.resolve(nodeList);
            }

            async.forEachSeries(nodes, each, done);
        })
        .fail(function(err){
           deferred.reject(err);
        });

        return deferred.promise;
    };

    /**
     * Method that will return all of the files saved in a node.
     */
    node.getAssets = function(nodeid){
        return assets.list({nodeid: nodeid});
    };

    node.getAsset = function(nodeid, filename){
        return assets.find({nodeid: nodeid, filename: filename});
    };

    node.saveAsset = function(nodeid, filename, path){
        return assets.save({nodeid: nodeid, filename: filename, path: path});
    };

    node.renameAsset = function(nodeid, original, updated){
        return assets.rename({nodeid: nodeid, original: original, updated: updated});
    };

    node.moveAsset = function(nodeid, newnodeid, filename){
        return assets.move({nodeid: nodeid, newnodeid: newnodeid, filename: filename});
    };

    node.copyAsset = function(nodeid, newnodeid, filename){
        return assets.copy({nodeid: nodeid, newnodeid: newnodeid, filename: filename});
    };

    node.deleteAsset = function(nodeid, filename){
        return assets.delete({nodeid: nodeid, filename: filename});
    };

    node.deleteAllAssets = function(nodeid){
        return assets.deleteAll({nodeid: nodeid});
    };

    node.getFilesDeepLoad = function(){

    };

    node.deleteById = function(id){
        var deferred = q.defer();

        // When we delete a node we also need to delete the subnodes
        this.getByIdDeep(id)
            .then(function(nodeList){
                function deleteNode(node, cb){
                    var nodeid = node._id.toString();

                    async.waterfall([
                        function(next){
                            db.nodes.deleteById(nodeid)
                                .then(function(){
                                    next(null, nodeid);
                                })
                                .fail(function(err){
                                    next(err);
                                });
                        },
                        //function(next){
                        //TODO when content code is added then we also need to delete the content
                        //},
                        function(id, next){
                            assets.deleteAll({nodeid: id})
                                .then(function(obj){
                                    next(null, id);
                                })
                                .fail(function(err){
                                    next(err);
                                });
                        },
                        function(id, next){
                            assets.removeDirectory({nodeid: id})
                                .then(function(){
                                    next();
                                })
                                .fail(function(err){
                                    next(err);
                                });
                        }
                    ],function(err, data){
                        cb(err);
                    });
                }

                function done(err){
                    if(err){
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve("Success");
                    }
                }

                async.each(nodeList, deleteNode, done);
            })
            .fail(function(err){
               deferred.reject(err);
            });

        return deferred.promise;
    };

    node.create = function(obj){
        var deferred = q.defer();

        async.waterfall([
            function(next){
                //[TODO] Call method to move all permissions down to the new node.
                db.nodes.create(obj)
                    .then(function(val){
                        next(null, val);
                    })
                    .fail(function(err){
                       next(err);
                    });
            },
            function(node, next){
                assets.createDirectory({nodeid: node._id.toString()})
                    .then(function(){
                        next(null, node);
                    })
                    .fail(function(err){
                        next(err);
                    });
            }
        ], function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    node.update = function(obj){
        return db.nodes.update(obj);
    };

    node.addContentTypes = function(id, obj){
        var types = obj,
            deferred = q.defer();

        if(!(obj instanceof Array)){
            types = [obj];
        }

        async.each(types, function(item, next){
            db.contentTypes.getById(item.id)
                .then(function(value){
                    next(null);
                })
                .fail(function(err){
                    next(new Error("Content type does not exist."));
                });
        }, function(err){
            if(!err){
                db.nodes.addContentTypes(id, types)
                    .then(function(value){
                        deferred.resolve("Success");
                    })
                    .fail(function(err){
                        deferred.reject(err);
                    });
            }
            else {
                deferred.reject(err);
            }
        });

        return deferred.promise;
    };

    node.deleteContentTypes = function(obj){
        var deferred = q.defer();

        deferred.resolve();

        return deferred.promise;
    };

    module.exports = node;
})();