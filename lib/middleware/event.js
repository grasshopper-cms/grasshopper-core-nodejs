/**
 * Middleware that will emit a named event and pass along the kontx.event.filter and
 * kontx.event.payload objects to the event handler.
 *
 * @param name
 * @returns {emitEvent}
 */
module.exports = function(name){
    'use strict';

    var _ = require('underscore'),
        events = require('../event');

    return function emitEvent(kontx, next){

        /*if( !_.isUndefined( kontx.event ) &&
            !_.isUndefined( kontx.event.filter ) &&
            !_.isUndefined( kontx.event.payload )
        ) {
            events.emit( name, kontx.event.filter, kontx.event.payload );
        }*/

        next();
    };
};