module.exports = (function(){
    'use strict';

    var _ = require('underscore'),
        tokens = require('../../entities/tokens'),
        Strings = require('../../strings'),
        strings = new Strings('en');

    return function identity(kontx, next){
        if(_.isUndefined(kontx.token)){
            next(new Error(strings.group('errors').missing_token));
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
})();