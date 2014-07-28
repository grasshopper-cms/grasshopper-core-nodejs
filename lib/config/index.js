'use strict';

var _ = require('underscore'),
    defaultPageSize = 100000,
    conf = {
        db: {},
        crypto: {},
        cache: {},
        assets: {},
        logger : {},
        identities : {}
    };

    conf.init = function(conf){
        if ( !_.isUndefined(conf) ) {
            this.db = conf.db;
            this.crypto = conf.crypto;
            this.cache = conf.cache;
            this.assets = conf.assets;
            this.logger = conf.logger;
            this.identities = conf.identities;

            if (!_.isUndefined(conf.db) && (!_.has(conf.db, 'defaultPageSize') || _.isUndefined(conf.db.defaultPageSize))) {
                this.db.defaultPageSize = defaultPageSize;
            }
        }
        else {
            this.db.defaultPageSize = defaultPageSize;
        }
    };

module.exports = conf;


