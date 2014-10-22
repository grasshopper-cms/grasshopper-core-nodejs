'use strict';

var _ = require('lodash'),
    config = require('../../config');

module.exports = query;

function query(kontx, next) {

    var options = kontx.args.options || {};
    console.log(options);
}
