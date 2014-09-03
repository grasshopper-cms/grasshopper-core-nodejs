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

    console.log('HEEEEEEEEEERE THEY AAAAAAARE');
    console.log(kontx.args.fields);
    console.log('HEEEEEEEEEERE THEY AAAAAAARE');
    kontx.args.fields = _.map(kontx.args.fields, function (field) {
        console.log('-----------------------');
        console.log(field);
        console.log('-----------------------');
        if (!_.has(field, '_uid')) {
            field._uid = uuid.v1();
        }
        return field;
    });

   next();


};
