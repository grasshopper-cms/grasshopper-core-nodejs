/**
 * Module that initializes the solid-logger module with the configuration that was passed in the app.
 * Then this module is reused throughout the application.
 */
module.exports = (function (){
    'use strict';

    var logger = require('solid-logger-js'),
        config = require('../config');

    logger.init(config.logger);

    return logger;
})();