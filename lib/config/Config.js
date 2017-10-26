'use strict';
/**
 * The config module is responsible for setting any constant variable that is needed in the application. There are
 * 2 ways to set the configuration values for grasshopper.
 *
 * * Pass in the options to the function
 * * Set an environment variable with GHCONFIG (soon to be deprecated) or GRASSHOPPER_CONFIG
 */
var Config = function(options){
    var _ = require('lodash'),
        defaultPageSize = 100000;

    // Singleton snippet
    if ( Config.prototype._singletonInstance ) {
        return Config.prototype._singletonInstance;
    }

    Config.prototype._singletonInstance = this;

    this.db = {
        defaultPageSize: defaultPageSize
    };
    this.crypto = {};
    this.cache = {};
    this.assets = {};
    this.server = {
        proxy: false,
        maxFilesSize: (1024 * 1024 * 2), //2 megabytes
        maxFieldsSize: (1024 * 1024 * 2), //2 megabytes
        maxFields: 1000
    };
    this.logger = {
        adapters:[{
            type: 'console',
            application: 'grasshopper',
            machine: 'default'
        }]
    };
    this.identities = {};
    this.init = function(config){
        if ( !_.isUndefined(config) ) {
            _.assign( this.db, config.db );
            _.assign( this.crypto, config.crypto );
            _.assign( this.cache, config.cache );
            _.assign( this.assets, config.assets );
            _.assign( this.logger, config.logger );
            _.assign( this.identities, config.identities );
            _.assign( this.server, config.server );
        }

        return this;
    };

    // Initially set any environment variables.
    if(process.env.GHCONFIG || process.env.GRASSHOPPER_CONFIG){
        console.log('Configuration found in the environment. Using config set in process.env');
        this.init(JSON.parse(process.env.GHCONFIG || process.env.GRASSHOPPER_CONFIG));
    }

    // Init object with anything that was passed in.
    if(!_.isUndefined(options)){
        console.log('Config options have been passed in applying...');
        this.init(options);
    }
};

module.exports = Config;