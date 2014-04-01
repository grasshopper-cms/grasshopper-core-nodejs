module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    return new Schema({
        label : { type: String, required : true, trim: true },
        type : {type: ObjectId, ref: 'contentTypes'},
        node : {
            _id: {type: ObjectId, ref: 'nodes'},
            displayOrder: {type: Number}
        },
        fields: {}
    },{collection: 'content'});
})();