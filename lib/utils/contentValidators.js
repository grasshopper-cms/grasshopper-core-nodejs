'use strict';
/**
 * Modules returns an object that contains all of the available validation rules available for content.
 *
 * usage:
 *      var contentValidators = require('contentValidators'),
 *          validator = contentValidators.get(rule),
 *          isValid = validator(str, options);
 *
 */
var BB = require('bluebird'),
    _ = require('lodash');

module.exports = (function (){

    var db = require('../db'),
        validator = require('validator'),
        contentValidators = {
            'required': promisify( isRequired ),
            'alpha': promisify( isAlpha ),
            'alpha_numeric': promisify( isAlphaNumeric ),
            'number': promisify( isNumber ),
            'email': promisify( validator.isEmail ),
            'url': promisify( validator.isURL ),
            'date': promisify( validator.isDate ),
            'regex': promisify( matches ),
            'unique': promisify( isUnique )
        };

    /**
     * Promisify is a function that will take a sync function and wrap it in a promise, it will also resolve/reject
     * the promise. If the function passed in returns a promise it will pass it along.
     *
     * @param func
     * @returns {Function}
     */
    function promisify(func) {
        return function(str, options) {

            return new BB(function(resolve, reject) {
                var result;

                if (!_.isFunction(func)) {
                    reject();
                }
                else {
                    result = func(str, options);

                    if (_.isBoolean(result)) {
                        resolve(handleBoolean(result, resolve, reject));
                    }
                    else if (_.isFunction(result.then)) {
                        resolve(result);
                    }

                }
            });
        };
    }

    function handleBoolean(result, resolve, reject){

        if (result === true) {
            resolve(result);
        } else {
            reject(result);
        }
    }

    function isRuleValid(rule){
        var isValid = true,
            validationRule = contentValidators[rule.type];

        if(_.isFunction(validationRule)){
            //check each of the fields to make sure they are valid
        }
        return isValid;
    }

    function isRequired(str){
        return (!_.isUndefined(str) && !_.isNull(str) && !_.isEmpty(str));
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
        return new BB(function(resolve, reject) {
            var qry = [ { key: options.property, cmp: '=', value: str } ];

            db.content.query([], options.contentTypes, qry, {} ).then(
                function(payload) {
                    if(0 === payload.total){
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                }
            );
        });
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