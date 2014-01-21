/**
 * The runner coordinator is responsible for registering routes and handling calling all of the middlewares that belong
 * to those routes. A typical implementation is to "use" then "handle". NOTE: When you create middleware if you
 * want data to get bubbled up in the resolved promise you will need to add the data to the "payload" property.
 * This allows us to add things to the kontx but only bubble up specific data.
 *
 * Example:
 *       runner.use('example.method', [
 *          function(kontx, next){
 *                kontx.payload.test = 0;
 *                next();
 *          },
 *          function(kontx, next){
 *                kontx.payload.ab = 1;
 *                next();
 *           }
 *      ]);
 *
 *      runner.handle('example.method', {}).then(function(payload){
 *          payload.ab.not.equal(1);
 *      }).done();
 */
module.exports = (function(){
    'use strict';

    var app = {},
        _ = require('underscore'),
        async = require('async'),
        q = require('q');

    app.stack = [];

    /**
     * Sets up the route and maps the path to an array of functions that get executed in order.
     * @param path Route path
     * @param fn function or array of functions
     */
    app.use = function(path, fn){
        this.stack[path] = { handle: fn };
        return this;
    };

    /**
     * Method that executes all of the functions assigned to a route path. It does this in order and if there are
     * any errors along the way it will break the execution path. Function returns a promise.
     * @param path Example "example.method"
     * @param kontx Container object that keeps all of the data modified along the way.
     */
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