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
                excludes = _.clone(this.privateFields),
                includeExludes = [];

            // If any includes are passed in through the options clean up the
            // default excluded fields. A type can have some excluded fields by
            // default and if the user overrides this then we need to clean up the query.
            if(options && options.include){
                _.each(options.include, function(include){
                    //If the include matches an existing exclude then remove it from the
                    //excludes and also from the includes (you can't mix them)
                    excludes = _.remove(excludes, function(o){
                        if(o === include){
                            cleanOptions.include = _.remove(cleanOptions.include, function(i){
                                return i !== include;
                            });
                        }

                        return o !== include;
                    });

                });
            }

            includeExludes = _.union(cleanOptions.include,
                this.parseExclusion(cleanOptions.exclude),
                this.parseExclusion(excludes)
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
