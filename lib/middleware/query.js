module.exports = function query(collection) {
  'use strict';

  return function query(kontx, next) {
      var _ = require('lodash'),
          db = require('../db')(),
          config = require('../config'),
          options = kontx.args.options || {};

      function getListPageSize(options){
          return ( !_.isNull(options.limit) && !_.isUndefined(options.limit) && !_.isNaN(parseInt(options.limit, 10)) && _.isNumber(parseInt(options.limit, 10)) ) ?
              parseInt(options.limit, 10) : config.db.defaultPageSize;
      }

      function getListSkipSize(options){
          return ( !_.isNull(options.skip) && !_.isUndefined(options.skip) && !_.isNaN(parseInt(options.skip, 10)) && _.isNumber(parseInt(options.skip, 10)) ) ?
              parseInt(options.skip) : 0;
      }

      if(!_.isUndefined(kontx.args)){
          options.limit = getListPageSize(options);
          options.skip = getListSkipSize(options);
      }
      else {
          options.limit = config.db.defaultPageSize;
          options.skip = 0;
      }

      db[collection].query(kontx.args.filters, options).then(function(value){
              kontx.payload = value;
              next();
          },
          function(err){
              next(err);
          }).done();
  };
};