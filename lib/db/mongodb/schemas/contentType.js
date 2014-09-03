module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        Schema = mongoose.Schema,
        fieldValueSchema = new Schema({type: Schema.Types.Mixed}),
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
            dataType: [fieldValueSchema],
            defaultValue: [fieldValueSchema],
            validation: [fieldValueSchema],
            min: [fieldValueSchema],
            max: [fieldValueSchema],
            label: [fieldValueSchema],
            _uid: [fieldValueSchema]


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
    function isValidField(fieldObj){
        var err,
            props = _.keys(fieldObj),
            mandatoryProps = [
                '_id',
                'type'
            ];

        if(!_.isObject(fieldObj)) {
            err = new Error('Fields/Meta must be an instance of an object');
        } else {
            _.each(mandatoryProps, function(prop) {
                if(!_.contains(props, prop)){
                    err = new Error('"' + prop + '" property not found when validating the content type.');
                }
            });

            if(!err && fieldObj._id.indexOf(' ') !== -1) {
                err = new Error('ids for fields/meta cannot have any spaces.');
            }
        }

        return err;
    }



    /**
     * In order to be valid we are checking the following rules
     * 1) Collection must be an instance of an array
     * 2) Does the element in the Collection array have all of the necessary properties
     * 3) Are there any duplicate ids
     *
     * @param value
     * @returns {null}
     */
    function validateFieldType(fieldsCollection, blahArg){
        var err = false;
        console.log(fieldsCollection);
        console.log(this);
        console.log(blahArg);
        console.log('This was the actual fields collection');
        // ensure fieldsCollection is an array.
        // if(!_.isArray(fieldsCollection)) {
            err = true;

        console.log('blaaah got here!');

        // }

        // if(!err) {
        //     _.each(fieldsCollection, function(field){
        //         err = isValidField(field);
        //
        //     });
        // }

        return err;
    }





    return schema;
})();
