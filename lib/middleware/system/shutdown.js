'use strict';

var logger = require('../../utils/logger');

/**
 * Middleware that gets called when a system shutdown call has been made to the
 * grasshopper core system. If more items are required here to clean things up
 * then we can start adding them to here.
 */
module.exports = function shutdown(){
    var db = require('../../db');

    console.log('Shutting down database connection');

    db.close()
        .then(function(){
            process.exit(0);
        })
        .catch(function(err){
            console.log('ERROR:', err);
            process.exit(0);
        });
};
