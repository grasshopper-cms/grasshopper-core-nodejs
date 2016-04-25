'use strict';

var _ = require('lodash'),
    content = {
        insert: require('./insert'),
        getModel: require('./models')
    };


_.extend(content, require('./fields'));

module.exports = content;