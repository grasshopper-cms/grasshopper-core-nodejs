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
        validator = require('../../utils/contentValidators'),
        Strings = require('../../strings'),
        messages = new Strings('en').group('errors'),
        validationTemplate = _.template(messages.content_validation);

    // Check for a valid content type then iterate over all of the fields in the contentType
    async.waterfall( [ validateContentType, validateFields ], function(err) {
        next(err);
    });

    // Function will test to see if the content type is in the system.
    function validateContentType(cb){
        db.contentTypes.getById(kontx.args.type.toString()).then(
            function(contentType){
                cb(null, contentType);
            },
            function(){
                cb(createError(400, messages.invalid_content_type));
            });
    }

    // Function will iterate all the fields in the content type and check the validation rules for each one.
    function validateFields(contentType, cb){
        async.each( contentType.fields, validateField, function(err) {
            cb(err);
        });
    }

    // Function will iterate all of the validation rules for a specific field and perform the validation rule.
    function validateField(field, cb){
        async.each(field.validation, performValidation(field), function(err){
            cb(err);
        });
    }

    // Function actually tests the field for a specific validation rule.
    function performValidation(field){
        return function(rule, cb) {
            var valueToBeValidated = kontx.args.fields[field.id],
                validationRule = validator.get(rule);

            //Undefineds do not need to be validated unless the field is required
            if(rule._id === 'required' || !_.isUndefined(valueToBeValidated)){
                validationRule(valueToBeValidated, rule.options).then(
                    function() {
                        cb();
                    },
                    function () {
                        cb( createError( 400, validationTemplate( { label: field.label } ) ) );
                    }
                );
            }
            else {
                cb();
            }

        }
    }
};