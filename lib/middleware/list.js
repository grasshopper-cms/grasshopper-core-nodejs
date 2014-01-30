module.exports = function list(collection) {
    'use strict';

    var _ = require('underscore'),
        DEFAULT = {
        PAGE_SIZE: 20,
        PAGE_SKIP_SIZE: 0
    };

    function getListPageSize(options){
        return (options.limit !== null && _.isNumber(options.limit)) ? parseInt(options.limit, 10) : DEFAULT.PAGE_SIZE;
    }

    function getListSkipSize(options){
        return (options.skip !== null && _.isNumber(options.skip)) ? parseInt(options.skip) : DEFAULT.PAGE_SKIP_SIZE;
    }

    return function(kontx, next){

        var _ = require('underscore'),
            async = require('async'),
            db = require('../db'),
            args = kontx.args,
            options = {
                query: ''
            };

        if(!_.isArray(kontx.args)){
            args = [kontx.args];
        }

        if(!_.isUndefined(args[0])){
            options.limit = getListPageSize(args[0]);
            options.skip = getListSkipSize(args[0]);
        }
        else {
            options.limit = DEFAULT.PAGE_SIZE;
            options.skip = DEFAULT.PAGE_SKIP_SIZE;
        }

        async.parallel(
            [
                function(cb){
                    db[collection].list(options).then(function(value){
                            cb(null, value);
                        },
                        function(err){
                            cb(err);
                        }).done();
                },
                function(cb){
                    db.users.describe(options).then(function(value){
                            cb(null, value);
                        },
                        function(err){
                            cb(err);
                        }).done();
                }
            ],function(err, results){
                if(err){
                    next(err);
                }
                else {
                    kontx.payload = {
                        total: results[1][0].count,
                        limit: options.limit,
                        skip: options.skip,
                        results: results[0]
                    };
                    next();
                }
            }
        );
    };
};