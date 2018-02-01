module.exports = function list(collection) {
    'use strict';

    var _ = require('lodash'),
        config = require('../config');

    function getListPageSize(options){
        return ( ( !_.isUndefined(options.limit) && !_.isNull(options.limit) ) && _.isNumber(options.limit) ) ?
            parseInt(options.limit, 10) : config.db.defaultPageSize;
    }

    function getListSkipSize(options){
        return ( ( !_.isUndefined(options.skip) && !_.isNull(options.skip) ) && _.isNumber(options.skip) ) ?
            parseInt(options.skip) : 0;
    }

    function getSortOption(options) {
        return ( ( !_.isUndefined(options.sort) && !_.isNull(options.sort) ) ) ? options.sort : "";
    }

    return function(kontx, next){

        var async = require('async'),
            db = require('../db')(),
            args = kontx.args,
            options = {
                query: {}
            };

        if(!_.isArray(kontx.args)){
            args = [kontx.args];
        }

        if(!_.isUndefined(args[0])){
            options.limit = getListPageSize(args[0]);
            options.skip = getListSkipSize(args[0]);
            options.sort = getSortOption(args[0]);
        }
        else {
            options.limit = config.db.defaultPageSize;
            options.skip = 0;
            options.sort = "";
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
                    db[collection].describe(options).then(function(value){
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
                        total: _.isUndefined(results[1][0]) ? 0 : results[1][0].count,
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
