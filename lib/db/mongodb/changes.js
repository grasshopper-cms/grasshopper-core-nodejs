'use strict';

var mongoose = require('mongoose'),
    crud = require('./mixins/crud'),
    collectionName = 'changes',
    schema = require('./schemas/change');

module.exports = Object.create(crud, {
    model: {value: mongoose.model(collectionName, schema)}
});
