/**
 * Modules returns an object that contains all of the available validation rules available for content.
 *
 * usage:
 *      var contentValidators = require('contentValidators'),
 *          validator = contentValidators.get(rule),
 *          isValid = validator(str, options);
 *
 */
module.exports = (function contentValidators(){
    'use strict';

    var db = require('../db'),
        _ = require('underscore'),
        validator = require('validator'),
        contentValidators = {
            'required': validator.isRequired,
            'alpha': isAlpha,
            'alpha_numeric': isAlphaNumeric,
            'number': isNumber,
            'email': validator.isEmail,
            'url': validator.isURL,
            'date': validator.isDate,
            'regex': matches,
            'unique': isUnique
        };

    validator.extend('isRequired', function(str){
        return (!_.isUndefined(str) && !_.isNull(str));
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

    function isAlphaNumeric(str, options){
        var isValid = validator.isAlphanumeric(str);
        if(isValid && !_.isUndefined(options)){
            isValid =  validator.isLength(str, options.min, options.max);
        }
        return isValid;
    }

    function isNumber(str, options){
        var isValid = validator.isNumeric(str);
        if(isValid && !_.isUndefined(options)){
            isValid =  (Number(str) >= options.min && Number(str) <= options.max);
        }
        return isValid;
    }

    function matches(str, options){
        return validator.matches(str, options.pattern);
    }

    function isUnique(str, options){
        var qry = {
            filters: [ { key: options.field, cmp:'=', val: str} ]
        };

        if(!_.isUndefined(options.contentTypes)){
            qry.types = options.contentTypes;
        }

        db.content.query(qry).then(
            function(results){
                console.log(results);
            },
            function(err){
                console.log(err);
            }
        );
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