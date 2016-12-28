/**
 * Middleware that will delete a contentType from the system. When a contentType is deleted it will also delete all
 * content associated to it.
 *
 * used arguments: {id: id }
 *
 * kontx impact: adds the result of the call to the kontx.payload
 * result: makes neccessary db calls and fs calls to delete contentType and content
 *
 * @param kontx
 * @param next
 */
module.exports = function deleteById(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db')(),
        contentTypeId = kontx.args[0];

    function deleteContentType(id, cb){
        db.contentTypes.deleteById(id).then(function(){
                cb();
            },
            function(err){
                cb(err);
            });
    }

    function deleteContent(content, cb){
        db.content.deleteById(content._id.toString()).then(function(){
            cb();
        });
    }

    async.waterfall([
        function(cb){
            deleteContentType(contentTypeId, cb);
        },
        function(cb){
            //Delete all content with the deleted content type id.
            db.content.query([], [contentTypeId], [], {}).then(function(queryResults){
                async.each(queryResults.results, deleteContent, function(){
                    cb();
                });
            });
        }
    ], function(){
        kontx.payload = 'Success';
        next();
    });
};
