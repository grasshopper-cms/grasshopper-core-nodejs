'use strict';

module.exports = (function(){
    var conf = {
        db: {},
        crypto: {},
        cache: {},
        assets: {},
        logger : {}
    };

    conf.init = function(conf){
        this.db = conf.db;
        this.crypto = conf.crypto;
        this.cache = conf.cache;
        this.assets = conf.assets;
        this.logger = conf.logger;
    };

    return conf;
})();

