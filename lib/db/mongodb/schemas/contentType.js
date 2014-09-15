module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        uuid = require('node-uuid'),
        Schema = mongoose.Schema,
        fieldSchema = new Schema({
            _id: {
                type : String,
                required: true,
                validate: [
                    {
                        validator : hasSpaces,
                        msg : 'Content Type Field id\'s cannot have any spaces.'
                    }
                ]
            },
            type: {
                type : String,
                required: true
            },
            dataType: {
                type: String
            },
            options: {
                default: false
            },
            defaultValue: {
                type: Schema.Types.Mixed
            },
            validation: {
                type: Schema.Types.Mixed
            },
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            },
            label: {
                type: String,
                required: true
            },
            _uid: {
                type: String,
                default : uuid.v1
            }
        }),
        schema = new Schema({
            label : {
                type : String,
                required : true,
                trim: true
            },
            description : {
                type : String
            },
            helpText: {
                type : String
            },
            fields: [fieldSchema]
        });

    function hasSpaces(value) {
        return !_.isUndefined(value) && value.indexOf(' ') === -1;
    }

    schema.methods.getContentTypesByEmbeddedId = function(id) {
        return this.find({ fields: { $elemMatch: { options : id.toString() } } });
    };


/// EVERYTHING BELOW HERE IS OLD


    /**
     * A field is valid if:
     * 1) The passed in argument must be an instance of an object
     * 2) All of the mandatory properties are provided
     * 3) The id property cannot have any spaces
     * 4) The type property must be in the approved list
     * 5) The required property must be a boolean
     * @param key
     * @param obj
     * @returns {null}
     */
    // function isValidField(fieldObj){
    //     var err,
    //         props = _.keys(fieldObj),
    //         mandatoryProps = [
    //             '_id',
    //             'type'
    //         ];
    //
    //     if(!_.isObject(fieldObj)) {
    //         err = new Error('Fields/Meta must be an instance of an object');
    //     } else {
    //         _.each(mandatoryProps, function(prop) {
    //             if(!_.contains(props, prop)){
    //                 err = new Error('"' + prop + '" property not found when validating the content type.');
    //             }
    //         });
    //
    //         if(!err && fieldObj._id.indexOf(' ') !== -1) {
    //             err = new Error('ids for fields/meta cannot have any spaces.');
    //         }
    //     }
    //
    //     return err;
    // }



    /**
     * In order to be valid we are checking the following rules
     * 1) Collection must be an instance of an array
     * 2) Does the element in the Collection array have all of the necessary properties
     * 3) Are there any duplicate ids
     *
     * @param value
     * @returns {null}
     */
    // function validateFieldType(fieldsCollection){
    //     var err = false;
    //     // ensure fieldsCollection is an array.
    //     if(!_.isArray(fieldsCollection)) {
    //         err = true;
    //     }
    //
    //     // if(!err) {
    //     //     _.each(fieldsCollection, function(field){
    //     //         err = isValidField(field);
    //     //
    //     //     });
    //     // }
    //
    //     return err;
    // }
    //
    //
    // schema.path('fields').validate(function(fieldsCollection){
    //     return validateFieldType(fieldsCollection);
    // }, 'Invalid Field Object');

    return schema;
})();
