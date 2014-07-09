module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        _ = require('underscore'),
        crypto = require('../../../utils/crypto'),
        Strings = require('../../../strings'),
        strings = new Strings(),
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
            identities: {
                basic: {},
                google: {}
            },
            profile : {},
            permissions : [nodeSchema],
            enabled : { type: Boolean, default: true },
            dateCreated : { type: Date, default: Date.now },
            linkedIdentities : [],
            displayName : { type : String, default: '' }
        } );


    schema.methods.basicAuthentication = function (plaintext) {
        return (crypto.createHash(plaintext, this.identities.basic.salt) == this.identities.basic.hash && this.enabled);
    };

    schema.path('role').validate(function (value) {
        var roles = ['editor', 'author', 'reader', 'admin', 'none', 'external'],
            foundRole = _.find(roles, function(role){
                return role === value.toString();
            });

        return (_.isString(foundRole));
    }, 'User\'s role is invalid.');

    schema.pre('save', function(next) {
        next();
    });

    return schema;
})();