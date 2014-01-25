/**
 * The database module acts as a factory to instantiate and prepare the database engine that has been selected
 * for this api instance. It is intended to be simple but in case it gets more complicated over time we removed the
 * functionality from the app module.
 */
module.exports = (function(){
    'use strict';

    var config = require('../config'),
        db = {};

    try{
        db = require('./' + config.db.type);
    }
    catch(ex){
        console.log(ex);
        console.log('GRASSHOPPER NOT PROPERLY CONFIGURED. SEE DOCS ABOUT CONFIGURATION.');
    }
    return db;
})();

