/**
 * The mongodb module implements all of the operations needed to interface our cms with mongo.
 *
 * @returns {{}}
 */
module.exports = (function(){
    'use strict';
    var db = {},
        config = require('../config'),
        event = require('../event'),
        Strings = require('../strings'),
        strings = new Strings('en'),
        createError = require('../utils/error'),
        logger = require('../utils/logger'),
        mongoose = require('mongoose'),
        url =  config.db.host,
        options = {
            user: config.db.username,
            pass: config.db.password
        };

    db.tokens = require('./mongodb/tokens');
    db.users = require('./mongodb/users');
    db.contentTypes = require('./mongodb/contentTypes');
    db.nodes = require('./mongodb/nodes');
    db.content = require('./mongodb/content');

    mongoose.connect(url, options);

    if(config.db.debug){
        mongoose.set('debug', true);
    }

    // When successfully connected
    mongoose.connection.on('connected', function () {
        require('../utils/typeCache');
        logger.info(strings.group('notice').db_connected);
        event.emit('start', { system: 'db' } );
    });

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {
        logger.error(strings.group('errors').db_connection_error, err);
        event.emit('error', { system: 'db' } , createError(500, err) );
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        logger.info(strings.group('notice').db_disconnected);
        event.emit('stop', { system: 'db' } );
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            logger.info(strings.group('notice').db_disconnected);
            process.exit(0);
        });
    });

    db.mongoose = mongoose;
    return db;

})();
