module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        schema = new Schema({
            name : { type: String, required : true, trim: true },
            description: {type: String}
        });

    return schema;
})();