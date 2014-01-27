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
        err = new Error();

    if(_.isUndefined(code)){
        code = 500;
    }

    if(_.isUndefined(message)){
        message = strings.getErrorByCode(code);
    }

    err.message = message;
    err.errorCode = code;

    return err;
};