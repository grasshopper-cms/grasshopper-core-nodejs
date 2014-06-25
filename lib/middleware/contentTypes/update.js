
module.exports = function update(kontx, next){
    'use strict';

    var async = require('async'),
        _ = require('underscore'),
        db = require('../../db');

    async.waterfall([
        function(cb){
            db.contentTypes.update(kontx.args).then(
                function(payload){
                    cb(null, payload);
                },
                function(err){
                    cb(err);
                }
            );
        },
        function(typeobj, cb){
            db.content.updateLabelField( typeobj._id.toString(), _.first(typeobj.fields)._id).then(
                function(payload){
                    cb(null, typeobj);
                },
                function(err){
                    cb(err);
                }
            );
        }
    ],function(err, results){

        if(err) {
            next(err);
            return;
        }

        kontx.payload = results;
        next();
    });
};