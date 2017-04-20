'use strict';

const _ = require('lodash');

/**
 * The mongodb module implements all of the operations needed to interface our cms with mongo.
 *
 * @returns {{}}
 */
module.exports = (function(){

    var db = {},
        config = require('../config'),
        event = require('../event'),
        Strings = require('../strings'),
        strings = new Strings('en'),
        createError = require('../utils/error'),
        logger = require('../utils/logger'),
        mongoose = require('mongoose'),
        // Using BB for mongoose, since the long term plan is to switch from Q to BB
        BB = require('bluebird'),
        url =  config.db.host,
        options = {
            user: config.db.username,
            pass: config.db.password
        };

    mongoose.Promise = BB;

    if(config.db.debug){
        mongoose.set('debug', true);
    }

    db.connection = mongoose.createConnection(url, _.extend(config.db.options || {}, options));
    db.tokens = require('./mongodb/tokens')(db.connection);
    db.users = require('./mongodb/users')(db.connection);
    db.contentTypes = require('./mongodb/contentTypes')(db.connection);
    db.nodes = require('./mongodb/nodes')(db.connection);
    db.content = require('./mongodb/content')(db.connection);
    db.close = function(){
        return require('./mongodb/close')(db.connection);
    };

    // When successfully connected
    db.connection.on('connected', function () {
        require('../utils/typeCache');
        logger.info(strings.group('notice').db_connected);
        event.emit('start', { system: 'db' } );
    });

    // If the connection throws an error
    db.connection.on('error',function (err) {
        logger.error(strings.group('errors').db_connection_error, err);
        event.emit('error', { system: 'db' } , createError(500, err) );
    });

    // When the connection is disconnected
    db.connection.on('disconnected', function () {
        logger.info(strings.group('notice').db_disconnected);
        event.emit('stop', { system: 'db' } );
    });

    return db;
})();
