/**
 * The identity middleware will take a token that is passed in and validate it in the system.
 * @param kontx
 * @param next
 */
module.exports = function identity(kontx, next){
    'use strict';

    var _ = require('underscore'),
        tokens = require('../../entities/tokens'),
        Strings = require('../../strings'),
        strings = new Strings('en'),
        err = null;

    if(_.isUndefined(kontx.token)){
        err = new Error(strings.group('errors').missing_token);
        err.errorCode = strings.group('codes').unauthorized;
        next(err);
        return;
    }

    tokens.validate(kontx.token)
        .then(function(identity){
            kontx.user = identity;
            next();
        })
        .fail(function(err){
            next(err);
        }).done();
};