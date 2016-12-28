/**
 * Middleware that will insert a node to the system. It will also create a bucket for assets after the
 * node is created.
 *
 * args: complete node object
 *
 * kontx impact: adds the result of the call to the kontx.payload
 * result: makes db call to create a new node
 *
 * @param kontx
 * @param next
 */
module.exports = function insert(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db')(),
        assets = require('../../assets');

    async.waterfall([
        function(cb){
            db.nodes.insert(kontx.args)
                .then(function(val){
                    cb(null, val);
                })
                .fail(function(err){
                    cb(err);
                })
                .catch(function(err){
                    cb(err);
                })
                .done();
        },
        function(node, cb){
            assets.createDirectory( { nodeid : node._id.toString() })
                .then(function(){
                    cb(null, node);
                })
                .fail(function(err){
                    cb(err);
                });
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