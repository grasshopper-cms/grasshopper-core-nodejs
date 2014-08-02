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

    var _ = require('lodash'),
        listeners = require('./listeners'),
        channel = {},
        filters = {
            nodes: [],
            types: [],
            contentids: [],
            system: []
        };


    parseChannels();

    /**
     * Look at the passed in channel(s) and determine if they are singular or an array. Either parse the
     * single channel or iterate and parse each channel supplied.
     */
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

    /**
     * Check for node, type, system or contentid filters that were supplied with the channel. If they exist then
     * attribute the passed in values to our channel filter collection. '*' can be used as a wildcard.
     *
     * @param channel
     */
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

        if(!_.isUndefined(filter.system)){
            filters.system.push(filter.system);
        }

        if(!_.isUndefined(filter.type)){
            filters.types.push(filter.type);
        }

        if(!_.isUndefined(filter.contentid)){
            filters.contentids.push(filter.contentid);
        }
    }

    /**
     * Function accepts an event name and a handler that will get executed when the event is fired.
     *
     * @param name event name
     * @param handler event handler
     */
    channel.on = function(name, handler){
        listeners.register(name, filters, handler);
    };

    /**
     * Function accepts a name of an event to stop listening for.
     *
     * @param name event name
     */
    channel.off = function(name){
        listeners.unregister(name, filters);
    };

    return channel;
};