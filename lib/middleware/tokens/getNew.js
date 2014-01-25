module.exports = function getNewToken(kontx, next){
    'use strict';

    var _ = require('underscore'),
        Strings = require('../../strings'),
        db = require('../../db'),
        strings = new Strings('en'),
        t = uuid.v4(),
        err = new Error(strings.group('errors').invalid_login);
        err.errorCode = strings.group('codes').forbidden;

    if(!_.isUndefined(kontx.user)){
        db.tokens.create(t, kontx.user).then(function(){
                kontx.payload = t;
                next();
            }).fail(function(err){
                next(err);
            });
    }
    else {
        next(err);
    }
};

