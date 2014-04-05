/**
 * The channel module accepts a single channel or an array of channels and registers them with the grasshopper
 * event listener collection. If a channel already exists then we simply add the new handler to the existing
 * channel.
 *
 * Examples:
 *      /node/:nodeid/type/:typeid
 *      /node/:nodeid
 *      /type/:typeid
 *      /contentid/:contentid
 *      [ /node/:nodeid, /node/:nodeid ]
 *
 * @param channels
 * @returns {{}}
 */
module.exports = function(channels){
    'use strict';

    var _ = require('underscore'),
        listeners = require('./listeners'),
        channel = {},
        filters = {
            nodes: [],
            types: [],
            contentids: []
        };


    parseChannels();

    function parseChannels(){
        if(_.isArray(channels)) {
            _.each(channels, function(channel) {
                parseChannel(channel);
            });
        }
        else {
            parseChannel(channels);
        }
    }

    function parseChannel(channel){
        var parts = _.without(channel.split('/'), ''),
            filter = {};

        _.each(parts, function(item, index){
            if(index % 2 === 0) {
                filter[item] = parts[index + 1];
            }
        });

        if(!_.isUndefined(filter.node)){
            filters.nodes.push(filter.node);
        }

        if(!_.isUndefined(filter.type)){
            filters.types.push(filter.type);
        }

        if(!_.isUndefined(filter.contentid)){
            filters.contentids.push(filter.contentid);
        }
    }

    channel.on = function(name, handler){
        listeners.register(name, filters, handler);
    };

    return channel;
};