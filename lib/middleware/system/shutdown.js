'use strict';

/**
 * Middleware that gets called when a system shutdown call has been made to the
 * grasshopper core system. If more items are required here to clean things up
 * then we can start adding them to here.
 */
module.exports = function shutdown(){
    var db = require('../../db');

    db.close()
        .then(function(){
            process.exit(0);
        })
        .catch(function(){
            process.exit(0);
        });
};
