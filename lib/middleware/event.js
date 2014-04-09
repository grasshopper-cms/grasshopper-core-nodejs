/**
 * Middleware that will emit a named event and pass along the kontx.event.filter and
 * kontx.event.payload objects to the event handler.
 *
 * @param name
 * @returns {emitEvent}
 */
module.exports = function event (name){
    'use strict';

    var events = require('../event');

    return function emitEvent(kontx, next){
        events.emit( name, kontx.event.filter, kontx ).then(
            function (payload) {
                kontx = payload;
                next();
            },
            function (err) {
                next(err);
            }
        ).done();
    };
};