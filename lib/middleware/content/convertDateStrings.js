/* jshint maxdepth:5 */
'use strict';

var _ = require('underscore');

module.exports = function convertDateStrings(kontx, next){
    kontx.args = convertDates( kontx.args );
    next();
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
            if ( !isNumber( value ) && !_.isBoolean( value )) {
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