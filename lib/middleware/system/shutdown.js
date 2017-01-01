'use strict';

/**
 * Middleware that gets called when a system shutdown call has been made to the
 * grasshopper core system. If more items are required here to clean things up
 * then we can start adding them to here.
 */
module.exports = function shutdown(grasshopperInstance){

    console.log('Shutting down database connection');

    grasshopperInstance.close()
        .then(function(){
            process.exit(0);
        })
        .catch(function(err){
            console.log('ERROR:', err);
            process.exit(1);
        });
};
