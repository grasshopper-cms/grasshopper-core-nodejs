/**
 * Modules returns an object that contains all of the available validation rules available for content.
 *
 * usage:
 *      var contentValidators = require('contentValidators'),
 *          validator = contentValidators.get(rule),
 *          isValid = validator(str, options);
 *
 */
module.exports = (function (){
    'use strict';

    var db = require('../db'),
        _ = require('lodash'),
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
                deferred = q.defer(),
                promise = deferred.promise;

            if ( _.isBoolean(result) ) {
                if(result === true) {
                    deferred.resolve(result);
                }
                else {
                    deferred.reject(result);
                }
            }
            else if (_.isFunction(result.then) ) {
                promise = result;
            }

            return promise;
        };
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

    /**
     * Function that will check to see if a passed in property exists in the system. By default it will check all
     * content types. If you pass one/many content types along in the options then it will narrow it's search
     * to the desired content types.
     *
     * @param str Value to be tested for uniqueness
     * @param options { property: 'fields.property', contentTypes: [ 'contentTypeID' ] }
     * @returns {*}
     */
    function isUnique(str, options){
        var deferred = q.defer(),
            qry = [ { key: options.property, cmp: '=', value: str } ];

        db.content.query([], options.contentTypes, qry, {} ).then(
            function(payload) {
                if(payload.total === 0){
                    deferred.resolve(true);
                }
                else {
                    deferred.reject(false);
                }
            }
        );

        return deferred.promise;
    }

    /**
     * Returned value for this module. Module returns an object with a 'get' function that will return a function
     * for any validation methods that have been defined. If no validation function is found then the function will
     * always return true.
     */
    return {
        get: function(rule){
            return (isRuleValid(rule)) ?
                contentValidators[rule.type] :
                function(){
                    return true;
                };
        }
    };
})();