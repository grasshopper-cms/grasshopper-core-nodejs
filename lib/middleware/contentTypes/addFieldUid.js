/**
 * Middleware will take the currently saved contentType and add a unique identifier to each field object.
 *
 * @param kontx
 * @param next
 */
module.exports = function addFieldUid (kontx, next) {
    'use strict';

    var _ = require('lodash'),
        uuid = require('node-uuid');


    kontx.args.fields = _.map(kontx.args.fields, function (field, index) {

        // TODO: currently we try to add a field uid before running the mongoose validation functions,
        // so this is kludged in - this should be run after a doc.validateSync (which should be added to the runners)
        // unclear to me how to expose the method to the runner
        if (!_.isObject(field)) {
            kontx.args.fields[index] = field = {};
        }

        if (!_.has(field, '_uid')) {
            field._uid = uuid.v1();
        }
        return field;
    });

   next();


};