module.exports = function query(kontx, next) {
    'use strict';

    var _ = require('underscore'),
        db = require('../../db'),
        options = kontx.args.options || {},
        DEFAULT = {
            PAGE_SIZE: 20,
            PAGE_SKIP_SIZE: 0
        };

    function getListPageSize(options){
        return (( !_.isNull(options.limit) && !_.isUndefined(options.limit) ) && _.isNumber(options.limit)) ? parseInt(options.limit, 10) : DEFAULT.PAGE_SIZE;
    }

    function getListSkipSize(options){
        return (( !_.isNull(options.skip) && !_.isUndefined(options.skip) ) && _.isNumber(options.skip)) ? parseInt(options.skip) : DEFAULT.PAGE_SKIP_SIZE;
    }

    if(!_.isUndefined(kontx.args)){
        options.limit = getListPageSize(kontx.args);
        options.skip = getListSkipSize(kontx.args);
    }
    else {
        options.limit = DEFAULT.PAGE_SIZE;
        options.skip = DEFAULT.PAGE_SKIP_SIZE;
    }

    db.content.query(kontx.args.nodes, kontx.args.types, kontx.args.filters, options).then(function(value){
            kontx.payload = value;
            next();
        },
        function(err){
            next(err);
        }).done();
};