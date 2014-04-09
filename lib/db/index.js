/**
 * The database module acts as a factory to instantiate and prepare the database engine that has been selected
 * for this api instance. It is intended to be simple but in case it gets more complicated over time we removed the
 * functionality from the app module.
 */
module.exports = (function(){
    'use strict';

    var config = require('../config'),
        event = require('../event'),
        Strings = require('../strings'),
        strings = new Strings('en').group('errors'),
        err = require('../utils/error'),
        db = {};

    try{
        db = require('./' + config.db.type);
    }
    catch(ex){
        event.emit('error', { system: 'core' } , err(503, strings.configuration) );
    }
    return db;
})();

