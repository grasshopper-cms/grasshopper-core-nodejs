/**
 * Module that is used for validating the data and making sure that any rules established in the content type are
 * enforced and that data cannot get saved if it has invalid data.
 *
 * @param kontx
 * @param next
 */
module.exports = function validate(kontx, next){
    'use strict';

    var db = require('../../db'),
        _ = require('underscore'),
        async = require('async'),
        createError = require('../../utils/error'),
        Strings = require('../../strings'),
        messages = new Strings('en').group('errors'),
        contentTypeId = kontx.args.type.toString(),
        contentType;

    function validateContentType(cb){
        db.contentTypes.getById(contentTypeId).then(
            function(payload){
                contentType = payload;
                cb();
            },
            function(){
                cb(createError(400, messages.invalid_content_type));
            });
    }

    async.waterfall([validateContentType],function(err){
        next(err);
    });
};