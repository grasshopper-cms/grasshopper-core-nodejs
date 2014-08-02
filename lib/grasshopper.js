'use strict';

var q = require('q'),
    grasshopper = {
        init: function(options){
            this.config.init(options);
            this.db = require('./db');
            return this;
        },
        /**
         * Property to return the current loaded configuration
         * @type {*}
         */
        config: require('./config'),
        /**
         * Raw database layer
         * @type {exports}
         */
        db: {},
        /**
         * Expose the events that are taking place in grasshopper core.
         */
        event: require('./event'),
        /**
         * Expose the available roles in the system.
         */
        roles: require('./security/roles'),
        /**
         * Expose a function that you can use to authenticate and get a token to use for authenticated calls.
         */
        auth: require('./security/auth'),
        /**
         * Exposed function to get the current version of the grasshopper-core
         */
        version: require('./utils/version'),
        /**
         * Exposed function to get the google oAuth2 URL
         */
        googleAuthUrl: require('./utils/googleAuthUrl'),
        /**
         * Expose a function to aid in the building of queries against db
         * @type {{queryBuilder: exports}}
         */
        utilities: {
            queryBuilder : require('./utils/queryBuilder')
        },
        close: function() {
            require('./db/' + this.config.db.type + '/close')(this.db);
        },
        /**
         * The grasshopper request function will return back an object that can execute calls to the system.
         * If you are making an authenticated call then you should send in your token. If you are making a
         * public call then don't pass in an argument.
         * @param token
         * @returns {{users: *, tokens: *, content: *, contentTypes: *, nodes: *}}
         */
        request: function(token){
            return {
                users: require('./runners/users')(token),
                tokens: require('./runners/tokens')(token),
                content: require('./runners/content')(token),
                contentTypes: require('./runners/contentTypes')(token),
                nodes: require('./runners/nodes')(token),
                assets: require('./runners/assets')(token)
            };
        }
    };

module.exports = grasshopper;