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

grasshopper.run = function(token){
    var deferred = q.defer(),
        kontx = {};

    kontx.deferred = deferred;
    kontx.token = token;
    kontx.payload = {};

    return {
        users: require('./runners/users')(kontx)
    };
};


module.exports = grasshopper;