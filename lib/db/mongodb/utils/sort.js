
module.exports = function(docs, sortOption) {
    'use strict';
    var _ = require('lodash');

    return _.sortBy(docs, function(object){
        if (typeof object[sortOption] === 'string') {
            return object[sortOption].toLocaleLowerCase();
        } else {
            return object[sortOption];
        }

    });
};
