/**
 * Module that will load a resource file based off of a local
 * @param local Default should be 'en'
 */
var strings = function(local){
    'use strict';

    var _ = require('lodash'),
        languages = {
            en: require('./en')
        },
        lang = (_.isUndefined(local)) ? languages.en : languages[local];

    this.group = function(name) {
        return lang[name];
    };

    this.getErrorByCode = function(code){
        return lang.defaultErrors[code];
    };
};

module.exports = strings;