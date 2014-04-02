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
        validator = require('validator'),
        Strings = require('../../strings'),
        messages = new Strings('en').group('errors'),
        allowedRuleTypes = {
            'required': validator.isRequired,
            'alpha': validator.isAlpha,
            'alpha_numeric': validator.isAlphanumeric,
            'number': validator.isNumeric,
            'email': validator.isEmail,
            'url': validator.isURL,
            'datetime': validator.isDateTime,
            'date': validator.isDate,
            'time': validator.isTime,
            'regex': validator.matches
        };

    validator.extend('isRequired', function(str){
        return true;
    });

    validator.extend('isDateTime', function(str){
        return true;
    });

    validator.extend('isTime', function(str){
        return true;
    });

    validator.extend('isRuleValid', function(rule){
        return true;
    });

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
            if(validator.isRuleValid(rule)){
                console.log('rule is valid');
                performValidation(kontx.args, field, rule);
            }
        });
    }

    function performValidation(content, field, rule){
        console.log('validation is being performed.');
        var valueToBeValidated = content.fields[field.id],
            validationRule = allowedRuleTypes[rule._id],
            isValid = true;

        if(_.isFunction(validationRule)){
            if(_.isUndefined(rule.options)){
                isValid = validationRule(valueToBeValidated);
            }
            else {
                isValid = validationRule(validationRule, rule.options);
            }
        }

        if(!isValid){
            throw createError(400, 'Validation is not correct');
        }
    }

    function validateFields(contentType, cb){
        var d = domain.create();
        d.add(contentType);
        d.on('error', function(err) {
            console.log('domain error');
            console.log(err);
            cb(err);
        });
        d.run(function() {
            console.log('running in domain');
            _.each(contentType.fields, function(field){
                console.log(field);
                validateField(field);
            });
            console.log('done');
            cb(null);
        });
    }

    async.waterfall([validateContentType,validateFields],function(err){
        next(err);
    });
};