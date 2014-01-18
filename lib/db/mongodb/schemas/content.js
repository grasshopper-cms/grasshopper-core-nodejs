module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            slug : { type : String, required : true, unique: true, validate: validate('notContains', ' ') },
            type : {type: ObjectId, ref: 'contentTypes'},
            nonce: { type: String },
            status : {type: String},
            node : {
                _id: {type: ObjectId, ref: 'nodes'},
                displayOrder: {type: Number}
            },
            fields: {},
            author : {
                _id:  {type: ObjectId, ref: 'users'},
                name: {type: String}
            },
            changelog: [{
                _id: {type: ObjectId},
                name: {type: String},
                action: {type: String},
                date: { type: Date, default: Date.now }
            }],
            validTo: { type: Date, default: Date.now },
            validFrom: { type: Date, default: Date.now }
        },{collection: 'content'});

    return schema;
})();