/**
 * Middleware that will delete a node from the system. When a node is deleted it will also delete all
 * subnodes, content and assets that exist under that node.
 *
 * used arguments: {id: id }
 *
 * kontx impact: adds the result of the call to the kontx.payload
 * result: makes necessary db calls and fs calls to delete node, subnodes, content and assets
 *
 * @param kontx
 * @param next
 */
module.exports = function deleteById(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db')(),
        _ = require('lodash'),
        getChildren = require('./getChildren'),
        assets = require('../../assets'),
        nodeList = [];

    function deleteNode(nodeid, cb){
        db.nodes.deleteById(nodeid).then(function(){
                cb();
            },
            function(){
                cb();
            });
    }

    function deleteAssets(nodeid, cb){
        assets.deleteAll({ nodeid : nodeid.toString() })
            .done(cb);
    }

    function deleteAssetDirectories(nodeid, cb){
        assets.removeDirectory( { nodeid : nodeid.toString() })
            .done(cb);
    }

    function deleteContent(content, cb){
        db.content.deleteById(content._id.toString()).then(function(){
            cb();
        });
    }

    async.waterfall([
        function(cb){
            //Build list of nodes
            var k = {args: {id: kontx.args.id, deep:true}};
            nodeList.push(kontx.args.id);

            getChildren(k, function(){
                nodeList = _.map(k.payload, function(node){
                    return node._id.toString();
                }).concat(nodeList);
                cb();
            });
        },
        function(cb){
            //Delete all node objects starting with the passed in ID and all of it's children
            async.each(nodeList, deleteNode, function(){
                cb();
            });
        },
        function(cb){
            //Delete all assets from each node
            async.each(nodeList, deleteAssets, function(){
                cb();
            });
        },
        function(cb){
            //Delete node asset folders
            async.each(nodeList, deleteAssetDirectories, function(){
                cb();
            });
        },
        function(cb){
            //Delete all fo the content from each of the nodes
            db.content.query(nodeList, [], [], {}).then(function(contentList){
                async.each(contentList.results, deleteContent, function(){
                    cb();
                });
            },function(err){
                console.log(err);
            });
        }
    ], function(){
        kontx.payload = 'Success';
        next();
    });
};