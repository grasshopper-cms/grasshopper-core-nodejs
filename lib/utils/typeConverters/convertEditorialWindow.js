/* jshint maxdepth:3 */
'use strict';

var _ = require('lodash');

module.exports = function convertEditorial (values) {
    return _.mapValues(values, function(value){
        return new Date(value);
    });
};
