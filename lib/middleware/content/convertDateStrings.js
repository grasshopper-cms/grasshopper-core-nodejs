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

    for ( var property in obj ) {
        if ( obj.hasOwnProperty( property ) ) {
            if ( obj[ property ].constructor == Object ) {
                convertDates( obj[ property ] );
            } else {
                if ( !isNumber( obj[property] ) && !_.isBoolean( obj[property] )) {
                    dateTest = new Date( obj[ property ] );
                    monthTest = dateTest.getMonth() + 1;

                    if ( !_.isNaN( monthTest ) ) {
                        obj[ property ] = dateTest;
                    }
                }
            }
        }
    }

    return obj;
}