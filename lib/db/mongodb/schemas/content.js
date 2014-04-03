module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    return new Schema({
        type : {type: ObjectId, ref: 'contentTypes'},
        node : {
            _id: {type: ObjectId, ref: 'nodes'},
            displayOrder: {type: Number}
        },
        fields: {}
    },{collection: 'content'});
})();