/**
 * Recurrsively load node objects and also construct the children collection.
 * This is used to build a tree of objects to traverse. The children are not parsed as
 * part of the Query object.
 */
module.exports = function getChildNodesDeep(kontx, next){
    'use strict';

    var async = require('async'),
        q = require('q'),
        createError = require('../../utils/error'),
        db = require('../../db')(),
        security = require('../../security'),
        Strings = require('../../strings'),
        strings = new Strings(),
        nodeList = [];


    function getChildNodes(nodeid){
        var deferred = q.defer();

        db.nodes.getByParent(nodeid).then(
            function(nodes){
                function each(child, cb){
                    var userHasPermission = security.node.allowed(
                        child._id.toString(),
                        kontx.user.role,
                        kontx.user.permissions,
                        security.roles.READER);

                    if(userHasPermission){
                        nodeList = nodeList.concat(child);

                        getChildNodes(child._id).then(
                            function(nodes){
                                nodeList = nodeList.concat(nodes);
                                cb(null);
                            },
                            function(err){
                                cb(err);
                            }).done();
                    }
                }

                function done(){
                    deferred.resolve(nodeList);
                }

                async.forEachSeries(nodes, each, done);
            },
            function(err){
                deferred.reject(err);
            }).done();

        return deferred.promise;
    }


    getChildNodes(kontx.args.nodeid).then(
        function(payload){
            //console.log(payload);
        },
        function(err){
            console.log(err);
        }
    ).done();
};
