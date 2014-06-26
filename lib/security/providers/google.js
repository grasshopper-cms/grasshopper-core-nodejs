var db = require('../../db'),
    q = require('q'),
    Strings = require('../../strings'),
    uuid  = require('node-uuid'),
    strings = new Strings('en'),
    err = new Error(strings.group('errors').invalid_login);

err.code = strings.group('codes').unauthorized;

module.exports = {
    auth: function(options){
        'use strict';
        var deferred = q.defer();



        return deferred.promise;
    }
};

