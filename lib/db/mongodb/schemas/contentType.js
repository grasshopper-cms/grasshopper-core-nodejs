module.exports = (function(){
    'use strict';

    var mongoose = require('mongoose'),
        _ = require('lodash'),
        Schema = mongoose.Schema,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            description : { type : String },
            helpText: { type : String },
            fields: { type: Schema.Types.Mixed, required: true }
        });

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
    function isValidField(key, obj){
        var err,
            props = _.keys(obj),
            mandatoryProps = [
                'label',
                'type'
            ];

        if(!(obj instanceof Object)){
            err = new Error('Fields/Meta must be an instance of an object');
        }
        else {
            _.each(mandatoryProps, function(prop){
                if(!_.contains(props, prop)){
                    err = new Error('"' + prop + '" property not found when validating the content type.');
                }
            });

            if(!err && key.indexOf(' ') >= 0){
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
    function validateFieldType(value){
        var err,
            keys = _.keys(value);

        _.each(keys, function(key){
            if(value.hasOwnProperty(key)){
                err = isValidField(key, value[key]);
            }
        });

        return (_.isUndefined(err));
    }
    schema.path('fields').validate(function(value){
        return validateFieldType(value);
    }, 'Invalid Field Object');

    return schema;
})();
