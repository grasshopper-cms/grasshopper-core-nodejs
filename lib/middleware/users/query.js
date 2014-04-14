module.exports = function query(kontx, next) {
    'use strict';

    var _ = require('underscore'),
        db = require('../../db'),
        config = require('../../config'),
        options = kontx.args.options || {};

    function getListPageSize(options){
        return (( !_.isNull(options.limit) && !_.isUndefined(options.limit) ) && _.isNumber(options.limit)) ?
            parseInt(options.limit, 10) : config.db.defaultPageSize;
    }

    function getListSkipSize(options){
        return (( !_.isNull(options.skip) && !_.isUndefined(options.skip) ) && _.isNumber(options.skip)) ?
            parseInt(options.skip) : 0;
    }

    if(!_.isUndefined(kontx.args)){
        options.limit = getListPageSize(kontx.args);
        options.skip = getListSkipSize(kontx.args);
    }
    else {
        options.limit = config.db.defaultPageSize;
        options.skip = 0;
    }

    db.users.query(kontx.args.filters, options).then(function(value){
            kontx.payload = value;
            next();
        },
        function(err){
            next(err);
        }).done();
};