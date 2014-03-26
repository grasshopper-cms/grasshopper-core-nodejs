module.exports = function deleteById(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db');

    //[TODO] Delete all content in deleted node and delete all assets. Need to also delete all of the other nodes in the tree
    async.waterfall([
        function(cb){
            db.nodes.deleteById(kontx.args.id).then(
                function(val){
                    cb(null, val);
                },
                function(err){
                    cb(err);
                }).done();
        }
    ], function(err, data){
        if(err){
            next(err);
        } else {
            kontx.payload = data;
            next();
        }
    });
};

/*
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
                        .then(function(){
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
            ],function(err){
                cb(err);
            });
        }

        function done(err){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve('Success');
            }
        }

        async.each(nodeList, deleteNode, done);
    })
    .fail(function(err){
        deferred.reject(err);
    });

return deferred.promise;
*/