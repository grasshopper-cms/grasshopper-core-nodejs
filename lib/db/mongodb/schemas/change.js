'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = new Schema({
    data : {
        collection : String,
        method : String,
        query: String,
        doc: String
    },
    created: { type: Date, default: Date.now }
}, {collection: 'changes'});
