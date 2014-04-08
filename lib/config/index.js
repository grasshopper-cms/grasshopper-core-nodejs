module.exports = (function(){
    'use strict';

    var _ = require('underscore'),
        conf = {
            db: {},
            crypto: {},
            cache: {},
            assets: {},
            logger : {}
        };

    conf.init = function(conf){
        if ( !_.isUndefined(conf) ) {
            this.db = conf.db;
            this.crypto = conf.crypto;
            this.cache = conf.cache;
            this.assets = conf.assets;
            this.logger = conf.logger;
        }
    };

    return conf;
})();

