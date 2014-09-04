module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    return new Schema({
        meta: {
            node : { type: ObjectId, ref: 'nodes'},
            type : { type: ObjectId, ref: 'contentTypes'},
            typelabel: {type: String},
            labelfield: { type: String },
            lastmodified: { type: Date, default: Date.now },
            created: { type: Date, default: Date.now }
        },
        fields: {}
    },{collection: 'content'});
})();
