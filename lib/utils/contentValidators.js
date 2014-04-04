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
        q = require('q'),
        validator = require('validator'),
        contentValidators = {
            'required': promisify( validator.isRequired ),
            'alpha': promisify( isAlpha ),
            'alpha_numeric': promisify( isAlphaNumeric ),
            'number': promisify( isNumber ),
            'email': promisify( validator.isEmail ),
            'url': promisify( validator.isURL ),
            'date': promisify( validator.isDate ),
            'regex': promisify( matches ),
            'unique': promisify( isUnique )
        };

    validator.extend('isRequired', function(str){
        return (!_.isUndefined(str) && !_.isNull(str));
    });

    /**
     * Promisify is a function that will take a sync function and wrap it in a promise, it will also resolve/reject
     * the promise. If the function passed in returns a promise it will pass it along.
     *
     * @param func
     * @returns {Function}
     */
    function promisify(func) {
        return function(str, options) {
            var result = func(str, options),
                deferred = q.defer();

            if ( _.isBoolean(result) ) {
                if(result === true) {
                    deferred.resolve(result);
                }
                else {
                    deferred.reject(result);
                }

                return deferred.promise;
            }
            else {
                //Check if you get back a promise and reject or resolve it when operation is complete.
                return result;
            }
        }
    }

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