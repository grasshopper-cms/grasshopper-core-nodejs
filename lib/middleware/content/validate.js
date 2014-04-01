/**
 * Module that is used for validating the data and making sure that any rules established in the content type are
 * enforced and that data cannot get saved if it has invalid data.
 *
 * @param kontx
 * @param next
 */
module.exports = function validate(kontx, next){
    'use strict';

    var db = require('../../db'),
        _ = require('underscore');

    next();
};