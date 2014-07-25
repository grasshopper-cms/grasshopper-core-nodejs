/* jshint maxdepth:3 */
'use strict';

var _ = require('lodash');

module.exports = function convertCheckbox (values) {
    return _.mapValues(values, function(value){
        return Boolean(value);
    });
};
