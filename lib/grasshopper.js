module.exports = function(options) {
    'use strict';

    /* NOTE: before requiring in an entity that uses the db a call to .configure needs to be done first */
    var grasshopper = {},
        config = require('./config').init(options),
        db = require('./db'),
        q = require('q');

    /**
     * Expose the events that are taking place in grasshopper core.
     */
    grasshopper.event = require('./event');

    /**
     * Expose the available roles in the system.
     */
    grasshopper.roles = require('./security/roles');

    /**
     * Expose a function that you can use to authenticate and get a token to use for authenticated calls.
     */
    grasshopper.auth = require('./security/auth');

    /**
     * Exposed function to get the current version of the grasshopper-core
     */
    grasshopper.version = require('./utils/version');

    /**
     * Exposed function to get the google oAuth2 URL
     */
    grasshopper.googleAuthUrl = require('./utils/googleAuthUrl');

    /**
     * Expose a function to aid in the building of queries against db
     * @type {{queryBuilder: exports}}
     */
    grasshopper.utilities = {
        queryBuilder : require('./utils/queryBuilder')
    };

    grasshopper.close = function() {
        require('./db/' + config.db.type + '/close')(db);
    };

    /**
     * The grasshopper request function will return back an object that can execute calls to the system.
     * If you are making an authenticated call then you should send in your token. If you are making a
     * public call then don't pass in an argument.
     * @param token
     * @returns {{users: *, tokens: *, content: *, contentTypes: *, nodes: *}}
     */
    grasshopper.request = function(token){
        var kontx = {};

        kontx.deferred = q.defer();
        kontx.token = token;
        kontx.payload = {};
        kontx.args = {};

        return {
            users: require('./runners/users')(kontx),
            tokens: require('./runners/tokens')(kontx),
            content: require('./runners/content')(kontx),
            contentTypes: require('./runners/contentTypes')(kontx),
            nodes: require('./runners/nodes')(kontx),
            assets: require('./runners/assets')(kontx)
        };
    };

    return grasshopper;
};
