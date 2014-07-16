/* jshint maxdepth:3 */
'use strict';

var _ = require('underscore');

module.exports = function convertDateStrings(kontx){
    kontx.args = convertDates( kontx.args );
};

function isNumber(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
}

function convertDates( obj ){
    var dateTest,
        monthTest;

    _.each(obj, function(value, key) {
        if ( Object === value.constructor || Array === value.constructor ) {
            convertDates( value );
        } else {
            if ( shouldConvertStringToDate(value) ) {
                dateTest = new Date( value );
                monthTest = dateTest.getMonth() + 1;

                if ( !_.isNaN( monthTest ) ) {
                    obj[key] = dateTest;
                }
            }
        }
    });

    return obj;
}

// TODO: move into own module and wrap a few tests around this thing
function shouldConvertStringToDate(value) {
    if (isNumber(value) || _.isBoolean(value)) {
        return false;
    }
    return /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.test(value); /* jshint ignore:line */
}