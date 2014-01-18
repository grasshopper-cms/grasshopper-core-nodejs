/*
 The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
 all connections.
 */
"use strict";

var _ = require('underscore');

module.exports = {
    privateFields: [],
    parseOptions: function(options){
        var opt = (!options) ? {} : options;

        if(!opt.include){
            opt.include = [];
        }
        if(!opt.exclude){
            opt.exclude = [];
        }

        return opt;
    },
    parseExclusion: function(arr){
        var separator = "-";

        return _.map(arr, function(item){
            return separator + item;
        });
    },
    /**
     * Build string variable that can be sent to mongo query to include or exclude fields in the response. Your
     * implementation module should set "privateFields" so that we can use the parameter here.
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

        return includeExludes.join(" ");
    }
};