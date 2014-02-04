module.exports = function insert(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db');

    async.waterfall([
        function(cb){
            //[TODO] Call method to move all permissions down to the new node.
            db.nodes.insert(kontx.args).then(
                function(val){
                    cb(null, val);
                },
                function(err){
                    cb(err);
                }).done();
        },
        function(node, cb){
            cb(null, node);
            /*assets.createDirectory({nodeid: node._id.toString()})
                .then(function(){
                    cb(null, node);
                })
                .fail(function(err){
                    cb(err);
                });*/
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