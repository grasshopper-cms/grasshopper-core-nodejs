/**
 * The couchdb module implements all of the operations needed to interface our cms with couch db.
 * @param config Database configuration values.
 * @returns {{}}
 */
module.exports = function initCouch(config){
    "use strict";

    var LOGGING_CATEGORY = 'NANO-AUTH',
        AUTH_TOKEN_KEY = 'couch-cookie',
        http = require('http'),
        url = require('url'),
        nano = require('nano')({
            "url": url.resolve(config.host, config.database),
            "log": log
        }),
        db = {},
        internal = {};

    internal.config = config;

    function log(data) {
        internal.app.log.info(LOGGING_CATEGORY, data);
    }
    /**
     * setCookie method will add the cookie value gathered from couch db and save it to our cache. We can then use this
     * cookie string to make subsequent requests.
     * @param val String value of cookie header.
     * @param callback Callback method that tells the calling function if the operation was successful or not.
     */
    function setCookie(val, callback){
        internal.app.cache.add(AUTH_TOKEN_KEY, val, function(val){
            internal.app.log.info(LOGGING_CATEGORY, 'Added cache item for "' + AUTH_TOKEN_KEY + '" with value of "' + val + '"');
            if(val){
                callback.call(this, true);
            }
            else {
                callback.call(this, false);
            }
        });
    }

    /**
     * authenticate method will call the couchdb authenticate API and return back a HTTP response with a auth cookie.
     * We need to save this value and pass it back later with all of our requests.
     * @param callback Callback method will respond cookie value or a "false" if the operation failed.
     */
    function authenticate(callback){
        nano.auth(internal.config.username, internal.config.password, function (err, body, headers) {
            if (err) {
                internal.app.log.error(LOGGING_CATEGORY, err.stack);
            }
            else{
                if (headers && headers['set-cookie']) {
                    setCookie(headers['set-cookie'],function(val){
                        callback.call(this, val);
                    });
                }
                else {
                    internal.app.log.error(LOGGING_CATEGORY, "Response successfull but set-cookie header not present.");
                    callback.call(this, false);
                }
            }
        });
    }

    /**
     * The public init method binds the application to the db object as well as creates and validates the authentication
     * cookie for couch db.
     * @param app App object with references to our db, logging and caching modules.
     */
    db.init = function(app, callback){

        internal.app = app;

        //Check for auth token
        internal.app.cache.get(AUTH_TOKEN_KEY, function(val){
            //[TODO] There is an expiration date in the cookie, we will need to validate this and if it's expired get a new one.

            if(val != null){
                nano = require('nano')({
                    "url": url.resolve(config.host, config.database),
                    "log": log,
                    cookie: val
                });

                if(callback){
                    callback.call(this);
                }
            }
            else {
                authenticate(function(cookie){
                    if(cookie){
                        nano = require('nano')({
                            "url": url.resolve(config.host, config.database),
                            "log": log,
                            cookie: cookie
                        });
                    }

                    if(callback){
                        callback.call(this);
                    }
                });
            }
        });

    };

    return db;
};

