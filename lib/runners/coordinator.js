module.exports = (function(){
    'use strict';

    var app = {},
        _ = require('underscore'),
        async = require('async'),
        q = require('q');

    app.stack = [];

    app.use = function(path, fn){
        this.stack[path] = { handle: fn };
        return this;
    };

    app.handle = function(path, kontx){
        var route = this.stack[path],
            deferred = q.defer();;

        if(!_.isUndefined(route)){
            async.applyEachSeries(route.handle, kontx, function(err){
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(kontx.payload);
                }
            });
        }

        return deferred.promise;
    };

    return app;
})();