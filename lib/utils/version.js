/**
 * Module that returns the current version of the grasshopper-core app
 */
module.exports = (function version(){
    'use strict';

    var config = require('../../package.json');
    return config.version;

})();
