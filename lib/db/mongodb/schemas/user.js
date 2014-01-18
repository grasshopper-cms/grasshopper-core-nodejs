module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        _ = require("underscore"),
        crypto = require('../../../utils/crypto'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        nodeSchema = new Schema({
            nodeid : { type: ObjectId },
            role: {type : String }
        },{ _id: false }),
        schema = new Schema({
            firstname : { type: String, trim: true, required: true },
            lastname : { type: String, trim: true, required: true },
            email : { type : String, required : true, lowercase: true, trim: true},
            role : { type : String, required : true, default: 'reader' },
            login :  { type : String, required : true, trim: true, index : { unique : true }, validate: validate('len', 4)},
            pass_hash : { type : String, required : true },
            salt      : { type : String, required : true },
            profile : {},
            permissions : [nodeSchema],
            enabled : { type: Boolean, default: true },
            dateCreated : { type: Date, default: Date.now }
        });


    schema.virtual('password').set(function (password) {
        if(password && password.length >= 6){
            this.salt = crypto.createSalt();
            this.pass_hash = crypto.createHash(password, this.salt);
        }
    });

    schema.path('role').validate(function (value) {
        var roles = ["editor", "author", "reader", "admin", "none", "external"],
            foundRole = _.findWhere(roles, value);

        return (foundRole != null);
    }, 'Invalid role.');

    schema.virtual('password').get(function () {
        return this.pass_hash;
    });

    schema.methods.authenticate = function (plaintext) {
        return (crypto.createHash(plaintext, this.salt) == this.password && this.enabled);
    };

    return schema;
})();