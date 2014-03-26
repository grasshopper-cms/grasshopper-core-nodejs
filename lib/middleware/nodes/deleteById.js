module.exports = function deleteById(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db');

    //[TODO] Delete all content in deleted node and delete all assets.
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