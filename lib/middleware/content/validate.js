/**
 * Module that is used for validating the data and making sure that any rules established in the content type are
 * enforced and that data cannot get saved if it has invalid data.
 *
 * @param kontx
 * @param next
 */
module.exports = function validate(kontx, next) {
    'use strict';

    var db = require('../../db')(),
        _ = require('lodash'),
        async = require('async'),
        createError = require('../../utils/error'),
        validator = require('../../utils/contentValidators'),
        Strings = require('../../strings'),
        q = require('q'),
        messages = new Strings('en').group('errors'),
        validationTemplate = _.template(messages.content_validation);

    // Check for a valid content type then iterate over all of the fields in the contentType
    async.waterfall([validateContentType, validateFields], function(err) {
        next(err);
    });

    // Function will test to see if the content type is in the system.
    function validateContentType(cb) {
        if (!_.isUndefined(kontx.args.meta) && !_.isUndefined(kontx.args.meta.type)) {
            db.contentTypes.getById(kontx.args.meta.type.toString()).then(
                function(contentType) {
                    cb(null, contentType);
                },
                function() {
                    cb(createError(400, messages.invalid_content_type));
                });
        } else {
            cb(createError(400, messages.invalid_content_type));
        }

    }

    // Function will iterate all the fields in the content type and check the validation rules for each one.
    function validateFields(contentType, cb) {
        if (_.isArray(contentType.fields)) {
            async.each(contentType.fields, validateField, function(err) {
                cb(err);
            });
        } else {
            cb();
        }
    }

    // Function will iterate all of the validation rules for a specific field and perform the validation rule.
    function validateField(field, cb) {
        if (_.isArray(field.validation)) {
            async.each(field.validation, performValidation(field), function(err) {
                cb(err);
            });
        } else {
            cb();
        }
    }

    // Function actually tests the field for a specific validation rule.
    function performValidation(field) {
        return function(rule, cb) {
            var valueToBeValidated = kontx.args.fields[field._id],
                validate = validator.get(rule);

            //Undefined values do not need to be validated unless the field is required
            if (rule.type === 'required' || !_.isUndefined(valueToBeValidated)) {
                if (_.isArray(valueToBeValidated)) {
                    q.all(
                        _.map(valueToBeValidated, function(value) {
                            return validate(value, rule.options);
                        })
                    )
                        .then(
                            function() {
                                cb();
                            },
                            function() {
                                cb(createError(400, validationTemplate({
                                    label: field.label
                                })));
                            }
                    );
                } else {
                    validate(valueToBeValidated, rule.options)
                        .then(
                            function() {
                                cb();
                            },
                            function() {
                                cb(createError(400, validationTemplate({
                                    label: field.label
                                })));
                            }
                    );
                }
            } else {
                cb();
            }
        };
    }
};
