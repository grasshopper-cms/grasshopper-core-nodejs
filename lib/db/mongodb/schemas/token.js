module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        schema = new Schema({
            _id : { type:String, required: true,unique: true },
            uid : { type: String, required : true, trim: true },
            created : { type: Date, default: Date.now }
        });

    return schema;
})();