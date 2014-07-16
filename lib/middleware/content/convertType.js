/* jshint maxdepth:3 */
'use strict';

var db = require('../../db'),
    _ = require('underscore'),
    convertDateStrings = require('../../utils/typeConverters/convertDateStrings'),
    Q = require('q');

module.exports = function convertType (kontx, next) {

    getType()
        .fail(function(error){
            next(error);
        })
        .done(function(){
            next();
        });

    function getType () {
        var deferred = new Q.defer();

        if( !_.isUndefined(kontx.args.meta) && !_.isUndefined(kontx.args.meta.type) ) {
            db.contentTypes.getById(kontx.args.meta.type.toString())
                .then(
                    iterateTypes.bind(this, deferred),
                    deferred.reject);
        }
        else {
            deferred.reject();
        }

        return deferred.promise;
    }

    function iterateTypes (deferred, contentType) {
        _.each(contentType.fields, checkType);

        deferred.resolve();
    }

    function checkType(field) {
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log(field);
        console.log('#############################');
        switch(field.type) {
        case 'boolean':
        case 'radio':
            break;
        case 'date':
        case 'datetime':
            break;
        case 'editorialwindow':
            break;
        case 'richtext':
            break;
        case 'readonly':
        case 'slug':
        case 'textbox':
        case 'textarea':
            break;
        case 'number':
            break;
        case 'keyvalue':
            break;
        case 'embeddedtype':
            break;
        case 'filereference':
            break;
        case 'dropdown':

        }
    }
};

