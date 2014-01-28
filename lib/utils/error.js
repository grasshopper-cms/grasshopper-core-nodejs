/**
 * Error module acts as a helper utility that will create an error object and set the code an the message for you
 * in one line of code. Message is an optional parameter and if it is not set then it will look for the default error
 * message for that error code.
 * @param code
 * @param message
 * @returns {Error}
 */
module.exports = function(code, message){
    'use strict';

    var _ = require('underscore'),
        Strings = require('../strings'),
        strings = new Strings('en'),
        err = new Error(),
        setDefaultErrorCode = false;

    //Set default values, optional code param
    if(code instanceof Error){
        message = code.message;

        if(!_.isUndefined(code.errorCode) && _.isNumber(code.errorCode)){
            code = code.errorCode;
        }
        else {
            setDefaultErrorCode = true;
        }
    }
    else if(_.isString(code)){
        message = code;
        setDefaultErrorCode = true;
    }

    if(_.isUndefined(code) || setDefaultErrorCode){
        code = 500;
    }

    if(_.isUndefined(message)){
        message = strings.getErrorByCode(code);
    }

    err.message = message;
    err.errorCode = code;

    return err;
};