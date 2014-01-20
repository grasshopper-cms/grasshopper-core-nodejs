'use strict';

/* NOTE: before requiring in an entity that uses the db a call to .configure needs to be done first */
var grasshopper = {},
    async = require('async'),
    config = require('./config'),
    q = require('q');

grasshopper.roles = require('./security/roles');
grasshopper.auth = require('./security/auth');

grasshopper.configure = function(method){
    method.apply(this);
    config.init(this.config);
    require('./db');
};

grasshopper.use = function(token){
    var tokens = require('./entities/tokens'),
        deferred = q.defer(),
        kontx = {};

    kontx.deferred = deferred;

    tokens.validate(token)
        .then(function(identity){
            kontx.token = token;
            kontx.user = identity;
        })
        .fail(function(err){
            deferred.reject(err);
        });


    return {
        users: require('./proxy/users').apply(kontx),
        user: {
            create: function(){


                setTimeout(function(){
                    deferred.resolve(true);
                },1500);

                return deferred.promise;
            }
        }

    };
};


module.exports = grasshopper;