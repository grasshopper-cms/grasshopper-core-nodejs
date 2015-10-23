/*
 The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
 all connections.
 */
module.exports = (function(){
    'use strict';

    var _ = require('lodash');

    return {
        privateFields: [],
        parseOptions: function(options){
            var opt = (_.isUndefined(options)) ? {} : options;

            if(_.isUndefined(opt.include)){
                opt.include = [];
            }
            if(_.isUndefined(opt.exclude)){
                opt.exclude = [];
            }

            return opt;
        },
        parseExclusion: function(arr){
            var separator = '-';

            return _.map(arr, function(item){
                return separator + item;
            });
        },
        /**
         * Build string variable that can be sent to mongo query to include or exclude fields in the response. Your
         * implementation module should set 'privateFields' so that we can use the parameter here.
         *
         * @param options Query options object
         * @returns {string}
         */
        buildIncludes: function(options){
            var cleanOptions = this.parseOptions(options),
                includeExludes = _.union(cleanOptions.include,
                    this.parseExclusion(cleanOptions.exclude),
                    this.parseExclusion(this.privateFields)
                );

            return includeExludes.join(' ');
        },
        buildOptions: function(options){
            var opt = {};

            if(!_.isUndefined(options)){
                if((!_.isUndefined(options.sort) && !_.isFunction(options.sort)) || !_.isUndefined(options.sortBy)){
                    // Mongo queries are objects if asc / desc specified, otherwise they are strings
                    opt.sort = options.sort || options.sortBy;
                }
                if(!_.isUndefined(options.limit)){
                    opt.limit = parseInt(options.limit);
                }
                if(!_.isUndefined(options.skip) && parseInt(options.skip) >= 0){
                    opt.skip = parseInt(options.skip);
                }
            }

            return opt;
        }
    };
})();
