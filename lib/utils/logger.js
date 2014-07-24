/**
 * Module that initializes the solid-logger module with the configuration that was passed in the app.
 * Then this module is reused throughout the application.
 */
module.exports = (function (){
    'use strict';

    var logger = require('solid-logger-js'),
        _ = require('lodash'),
        config = require('../config');

    if( !_.isUndefined(config.logger) ){
        logger.init(config.logger);
    }
    else {
        logger.init({
            adapters:[{
                type: 'console',
                application: 'grasshopper',
                machine: 'default'
            }]
        });
    }

    return logger;
})();