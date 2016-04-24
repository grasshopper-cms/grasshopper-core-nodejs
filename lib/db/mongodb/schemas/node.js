module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            slug : { type: String, trim: true, unique: true } ,
            allowedTypes : [{type: ObjectId, ref: 'contentTypes'}],
            meta: { type: Schema.Types.Mixed },
            ancestors : [{type: ObjectId, ref: 'nodes'}],
            parent: {type: ObjectId, ref: 'nodes'}
        });


    /**
     * After a node is saved if a slug was not set then make it the same as the ID (as a string).
     */
    schema.post('validate', function(doc) {
        if(_.isUndefined(doc.slug) || (!_.isUndefined(doc.slug) && doc.slug.length === 0)){
            doc.slug = (doc._id) ? doc._id.toString() : '';
        }
    });

    return schema;
})();