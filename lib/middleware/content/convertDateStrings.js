'use strict';

var _ = require('underscore');

module.exports = function convertDateStrings(kontx, next){
    kontx.args = convert( kontx.args );
    next();
};

function convert( obj ){
    var dateTest;

    _.each(obj, function(property) {
        if ( obj[ property ].constructor == Object ) {
            convert( obj[ property ] );
        } else {
            if (!isNumberish( obj[property] ) && !_.isBoolean( obj[property] ) ) {
                dateTest = new Date( obj[ property ] );
                if (_.isNumber(dateTest.getMonth()) ) {
                    obj[ property ] = dateTest;
                }
            }
        }
    });

    return obj;
}

function isNumberish(number) {
    if (_.isNumber(number)) {
        return true;
    }
    return _.isString(number) && _.isNumber(parseFloat(number));
}