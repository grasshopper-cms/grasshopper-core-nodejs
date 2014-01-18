module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            name : { type: String, required : true, trim: true },
            scope : {}, //TODO This needs to be defined with out actual rules
            events : [{type: ObjectId, ref: 'hookevents'}],
            dateCreated : { type: Date, default: Date.now }
        });

    return schema;
})();