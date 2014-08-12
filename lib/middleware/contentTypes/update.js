
module.exports = function update(kontx, next){
    'use strict';

    var async = require('async'),
        _ = require('lodash'),
        db = require('../../db'),
        Strings = require('../../strings'),
        error = require('../../utils/error'),
        messages = new Strings('en').group('errors'),
        idsHaveChanged = false,
        changedIds = {
            contentTypeId : kontx.args._id,
            changes : []
        };

    async.waterfall([
        function(cb){
            db.contentTypes.getById(kontx.args._id).then(
                function(payload){
                    cb(null, payload);
                },
                function(err){
                    cb(err);
                }
            );
        },
        function(originalType, cb) {
            _.each(originalType.fields, function(field){
                var newId = _.find(kontx.args.fields,function(newField){
                    return newField._uid == field._uid;
                });

                if(newId && field._id != newId._id) {
                    idsHaveChanged = true;

                    changedIds.changes.push({
                        find : field._id,
                        change : newId._id,
                        on : field._uid
                    });
                }
            });

            cb();
        },
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
        function(typeobj,cb) {
            if(idsHaveChanged) {
                db.content.updateIds(changedIds)
                    .then(
                        function(){
                            cb(null, typeobj);
                        },
                        function(err){
                            cb(err);
                        }
                    );
            } else {
                cb(null, typeobj);
            }
        },
        function(typeobj, cb){
            var id = typeobj._id,
                firstField = _.first(typeobj.fields);

            if(_.isUndefined(firstField)){
                cb(error(404, messages.types_empty_fields));
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