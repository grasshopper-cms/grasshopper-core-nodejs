module.exports = function ( name, filter, payload ) {
    'use strict';

    var listeners = require('./listeners'),
        listener = listeners.filter(name, filter);

    console.log(listener);
};