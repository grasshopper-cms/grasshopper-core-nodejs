/**
 * Middleware that performs custom validation on a user model and can fail the request before going to the database.
 *
 * @param kontx
 * @param next
 */
module.exports = function validate(kontx, next){
    'use strict';

    var Strings = require('../../strings'),
        _ = require('underscore'),
        messages = new Strings().group('errors'),
        createError = require('../../utils/error'),
        user = kontx.args[0];



    if((!_.isUndefined(user.password) && !_.isNull(user.password)) && user.password.length < 6){
        next(createError(400, messages.user_password_too_short));
    }
    else {
        next();
    }
};