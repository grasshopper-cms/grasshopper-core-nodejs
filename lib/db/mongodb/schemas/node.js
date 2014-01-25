module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    return new Schema({
        label : { type: String, required : true, trim: true },
        allowedTypes : [{type: ObjectId, ref: 'contentTypes'}],
        meta: { type: Schema.Types.Mixed },
        ancestors : [{type: ObjectId, ref: 'nodes'}],
        parent: {type: ObjectId, ref: 'nodes'}
    });
})();