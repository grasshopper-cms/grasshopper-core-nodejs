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
        domain = require('domain'),
        createError = require('../../utils/error'),
        validator = require('../../utils/contentValidators'),
        Strings = require('../../strings'),
        messages = new Strings('en').group('errors');

    function validateContentType(cb){
        db.contentTypes.getById(kontx.args.type.toString()).then(
            function(contentType){
                cb(null, contentType);
            },
            function(){
                cb(createError(400, messages.invalid_content_type));
            });
    }

    function validateField(field){
        _.each(field.validation, function(rule){
            var valueToBeValidated = kontx.args.fields[field.id],
                validationRule = validator.get(rule),
                isValid = true;

            //Undefineds do not need to be validated unless the field is required
            if(rule._id === 'required' || !_.isUndefined(valueToBeValidated)){
                if(_.isUndefined(rule.options)){
                    isValid = validationRule(valueToBeValidated);
                }
                else {
                    isValid = validationRule(valueToBeValidated, rule.options);
                }

                if(!isValid){
                    throw createError(400, '"' + field.label + '" is not valid. Please check your validation rules and try again.');
                }
            }
        });
    }

    function validateFields(contentType, cb){
        var d = domain.create();
        d.add(contentType);
        d.add(validator);
        d.on('error', function(err) {
            delete err.domain;
            delete err.domainThrown;
            console.log(err);
            cb(err);
        });
        d.run(function() {
            _.each(contentType.fields, function(field){
                validateField(field);
            });
            cb(null);
        });
    }

    async.waterfall([validateContentType,validateFields],function(err){
        next(err);
    });
};