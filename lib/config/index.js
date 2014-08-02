'use strict';
/**
 * The config module is responsible for setting any constant variable that is needed in the application. There are
 * 2 ways to set the configuration values for grasshopper.
 *
 * * Pass in the options to the function
 * * Set an environment variable with GHCONFIG (soon to be deprecated) or GRASSHOPPER_CONFIG
 */


var config = (function(){
    var Config = require('./Config');
    return new Config();
})();


module.exports = config;