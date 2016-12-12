/* jshint maxdepth:3 */
'use strict';

var _ = require('lodash'),
    db = require('../../db')(),
    converters = require('../../utils/typeConverters'),
    foundField;

module.exports = function convertType(kontx, next){

    if( !_.isUndefined(kontx.args.meta) && !_.isUndefined(kontx.args.meta.type) ) {
        queryContentTypes();
    }
    else {
       createError('Malformed incoming data. No meta or meta type.');
    }

    function queryContentTypes() {
        db.contentTypes.getById(kontx.args.meta.type.toString())
            .then(
                parseContentType,
                createError
            );
    }

    function parseContentType(contentType) {
        _.each(kontx.args.fields, function(value, key){

            foundField = findField(contentType, key);
            if(foundField) {
                distributeType(key);
            }
        });
        convertAnyTextToDate();
        next();
    }

    function findField(contentType, key) {
        return _.find(contentType.fields, function(field) {
            return field._id == key;
        });
    }

    function distributeType(key) {
        switch(foundField.type) {
        case 'textarea':
        case 'textbox':
        case 'password':
        case 'readonly':
        case 'richtext':
        case 'slug':
            applyConverter(key, converters.string);
            break;
        case 'boolean':
            applyConverter(key, converters.boolean);
            break;
        case 'checkbox':
            applyConverter(key, converters.checkbox);
            break;
        case 'editorialwindow':
            applyConverter(key, converters.editorial);
            break;
        case 'number' :
            applyConverter(key, converters.number);
            break;
        case 'date':
        case 'datetime':
            applyConverter(key, converters.date);
            break;
        }
    }

    function convertAnyTextToDate() {
        kontx.args = converters.anyStringsToDates(kontx.args);
    }

    function applyConverter(key, converter) {
        var field = kontx.args.fields[key];

        if(_.isArray(field)) {
            field = _.map(field, converter);
        } else {
            field = converter(field);
        }

        kontx.args.fields[key] = field;
    }

    function createError(error) {
        if (error) {
            console.log(error);
        }
        next();
    }

};
