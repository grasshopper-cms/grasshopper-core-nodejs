module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        _ = require('underscore'),
        Schema = mongoose.Schema,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            description : { type : String },
            helpText: { type : String },
            fields: { type: Schema.Types.Mixed, required: true },
            meta: { type: Schema.Types.Mixed , required: true}
        }),
        AVAILABLE_FIELD_TYPES = [
            'readonly',
            'textbox',
            'textarea',
            'richtext',
            'dropdown',
            'checkbox',
            'content-reference',
            'file-reference',
            'datetime',
            'code-editor'
        ];

    /**
     * A field is valid if:
     * 1) The passed in argument must be an instance of an object
     * 2) All of the mandatory properties are provided
     * 3) The id property cannot have any spaces
     * 4) The type property must be in the approved list
     * 5) The required property must be a boolean
     * @param obj
     * @returns {null}
     */
    function isValidField(key, obj){
        var err = null,
            props = Object.keys(obj),
            mandatoryProps = [
                'label',
                'type',
                'instancing',
                'required'
            ];

        if(!(obj instanceof Object)){
            err = new Error("Fields/Meta must be an instance of an object");
        }
        else {
            for(var x = 0; x < mandatoryProps.length; x++){
                var prop = mandatoryProps[x];

                if(!_.contains(props, prop)){
                    err = new Error("'" + prop + "' property not found when validating the content type.");
                }
            }

            if(!err && key.indexOf(' ') >= 0){
                err = new Error("ids for fields/meta cannot have any spaces.");
            }

            if(!err && !_.contains(AVAILABLE_FIELD_TYPES, obj.type)){
                err = new Error("field type provided is not valid. ");
            }

            if(!err && (typeof obj.required != "boolean")){
                err = new Error("'required' field value should be a boolean.");
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
     * @param collection
     * @returns {null}
     */
    function validateFieldType(value){
        var err = null;

        for(var key in value){
            err = isValidField(key, value[key]);
        }

        //console.log(err);

        return (err == null);
    }
    schema.path('fields').validate(function(value){
        return validateFieldType(value);
    }, "Invalid Field Object");

    schema.path('meta').validate(function(value){
        return validateFieldType(value);
    }, "Invalid Meta Object");

    return schema;
})();