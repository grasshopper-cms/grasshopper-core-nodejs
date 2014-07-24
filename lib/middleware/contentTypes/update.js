
module.exports = function update(kontx, next){
    'use strict';

    var async = require('async'),
        _ = require('underscore'),
        db = require('../../db'),
        Strings = require('../../strings'),
        messages = new Strings('en').group('errors');

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
            var id = typeobj._id,
                firstField = _.first(typeobj.fields);

            if(_.isUndefined(firstField)){
                cb(new Error(messages.types_empty_fields));
            }
            else {
                db.content.updateLabelField( id.toString(), firstField._id).then(
                    function(payload){
                        cb(null, typeobj);
                    },
                    function(err){
                        cb(err);
                    }
                );
            }
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