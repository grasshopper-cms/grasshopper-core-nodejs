module.exports = function convertDateStrings(kontx, next){
    'use strict';

    var _ = require('underscore'),
        logger = require('../../utils/logger'),
        isDirty = false;

    function convert( obj ){
        var dateTest,
            monthTest;

        for ( var property in obj ) {
            if ( obj.hasOwnProperty( property ) ) {
                if ( obj[ property ].constructor == Object ) {
                    convert( obj[ property ] );
                } else {
                    if (!_.isNumber( obj[property] ) && !_.isBoolean( obj[property] ) ) {
                        dateTest = new Date( obj[ property ] );
                        monthTest = dateTest.getMonth() + 1;

                        if ( !_.isNaN( monthTest ) ) {
                            obj[ property ] = dateTest;
                            isDirty = true;
                        }
                    }
                }
            }
        }

        return obj;
    }

    kontx.args = convert( kontx.args );
    next();
};