'use strict';

var q = require('q');

/**
 * Module that will create a new instance of a kontx object. It is create new for every request to make
 * sure that data is not cached.
 * @param token
 * @returns {*}
 * @constructor
 */
var Kontx = function(token){
    if (!(this instanceof Kontx)) {
        return new Kontx(token);
    }

    return {
        deferred: q.defer(),
        token: token,
        payload: {},
        args: {}
    };
};

module.exports = Kontx;