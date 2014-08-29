(function(){
    'use strict';

    var search = {},
        internal = {},
        async = require('async'),
        q = require('q'),
        fs = require('fs'),
        config = require('../config').search,
        _ = require('lodash');

    internal.config = config;
    internal.engines = [];
    internal.selectedEngine = null;

    if(config.engines.elasticsearch) {
        internal.engines.elasticsearch = require('./elasticsearch').config(config.engines.elasticsearch);
    }

    internal.selectedEngine = internal.engines[config.default];

    search.query = function(params) {
        return internal.selectedEngine.query(params);
    }

    search.index = function(params) {
        return internal.selectedEngine.index(params);
    }

    search.ping = function() {
        return internal.selectedEngine.ping();
    }


    module.exports = search;
})();