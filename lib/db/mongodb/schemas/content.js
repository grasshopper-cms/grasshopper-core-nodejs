module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            slug : { type: String, trim: true, unique: true } ,
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


    /**
     * After a content type is saved if a slug was not set then make it the same as the ID (as a string).
     */
    schema.post('validate', function(doc) {
        if(_.isUndefined(doc.slug) || (!_.isUndefined(doc.slug) && doc.slug.length === 0)){
            doc.slug = (doc._id) ? doc._id.toString() : '';
        }
    });

    return schema;
})();