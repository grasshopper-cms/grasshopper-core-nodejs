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
            lastname : { type: String, trim: true },
            email : { type : String, lowercase: true, trim: true},
            role : { type : String, required : true, default: 'reader' },
            identities: {},
            slug : { type: String, trim: true, unique: true } ,
            profile : { type : {}, default: {} },
            permissions : [nodeSchema],
            enabled : { type: Boolean, default: true },
            dateCreated : { type: Date, default: Date.now },
            lastLogged: { type: Date, default: null },
            linkedidentities : [],
            displayname : { type : String, default: null },
            createdby: {
                id: String,
                displayname: String
            },
            updatedby: {
                id: String,
                displayname: String
            }
        }, { minimize : false } );


    /**
     * After a user is saved if a slug was not set then make it the same as the ID (as a string).
     */
    schema.post('validate', function(doc) {
        if(_.isUndefined(doc.slug) || (!_.isUndefined(doc.slug) && doc.slug.length === 0)){
            doc.slug = (doc._id) ? doc._id.toString() : '';
        }
    });
    
    function _setDefaultDisplayName() {
        var deferred = Q.defer(),
            identityType;

        // Should only set the display name the first time.
        if(_.isNull(this.displayname) && !_.isEmpty(this.identities)) {
            identityType = _.chain(this.identities).keys().without('toObject').first().value();

            switch(identityType) {
                case 'google':
                case 'facebook':
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
        } else {
            deferred.resolve();
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
