module.exports = (function(){
    'use strict';

    var _ = require('underscore'),
        tokens = require('../../entities/tokens');

    return function identity(kontx, next){
        if(_.isUndefined(kontx.token)){
            next(new Error('Token not provided.'));
            return;
        }

        tokens.validate(kontx.token)
            .then(function(identity){
                kontx.user = identity;
                next();
            })
            .fail(function(err){
                next(err);
            });
    };
})();