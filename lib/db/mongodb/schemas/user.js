module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        _ = require('lodash'),
        Q = require('q'),
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
            identities: {},
            profile : {},
            permissions : [nodeSchema],
            enabled : { type: Boolean, default: true },
            dateCreated : { type: Date, default: Date.now },
            linkedidentities : [],
            displayname : { type : String, default: '' },
            createdBy: {
                id: String,
                displayname: String
            },
            updatedBy: {
                id: String,
                displayname: String
            }
        } );


    function _setDefaultDisplayName() {
        var deferred = Q.defer(),
            identityType;

        // if this does not have a display name, or, the display name is empty
        if(!_.has(this, 'displayname') || _.has(this, 'displayname') && _.isEmpty(this.displayname) && !_.isEmpty(this.identities)) {
            identityType = _.chain(this.identities).keys().without('toObject').first().value();

            switch(identityType) {
                case 'google':
                    this.displayname = this.email;
                    deferred.resolve();
                    break;
                case 'basic':
                    this.displayname = this.identities.basic.username;
                    deferred.resolve();
                    break;
                default:
                    this.displayname = this.email;
                    deferred.resolve();
                    break;
            }
        }

        return deferred.promise;
    }

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
        _setDefaultDisplayName.call(this)
            .done(next);
    });

    return schema;
})();