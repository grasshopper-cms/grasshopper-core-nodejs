/**
 * Module that is used for validating the data and making sure that any rules established in the content type are
 * enforced and that data cannot get saved if it has invalid data.
 *
 * @param kontx
 * @param next
 */
module.exports = (function contentValidators(){
    'use strict';

    var db = require('../db'),
        _ = require('underscore'),
        async = require('async'),
        domain = require('domain'),
        validator = require('validator'),
        contentValidators = {
            'required': validator.isRequired,
            'alpha': isAlpha,
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

    function isRuleValid(rule){
        var isValid = true,
            validationRule = contentValidators[rule._id];

        if(_.isFunction(validationRule)){
            //check each of the fields to make sure they are valid
        }

        return isValid;
    }

    function isAlpha(str, options){
        var isValid = validator.isAlpha(str);
        if(isValid && !_.isUndefined(options)){
            isValid = validator.isLength(str, options.min, options.max);
        }
        return isValid;
    }

    function isUnique(str, options){

    }

    return {
        get: function(rule){
            return (isRuleValid(rule)) ?
                contentValidators[rule._id] :
                function(){
                    return true;
                };
        }
    };
})();