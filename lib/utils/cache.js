/**
 * The cache module wraps some file operations and makes it easy to save documents and key=values to disk. This is
 * used to save data that is needed when the application is restarted.
 */
(function(){
    "use strict";

    var path = require('path'),
        fs = require('fs'),
        config = require("../config").get("cache"),
        cache = {};

    /**
     * Get method will accept key and return the data or a null if it doesn't exist.
     * @param key String value of the cache key
     * @param cb callback that will either return the value or a null.
     */
    cache.get = function(key, cb){

        fs.readFile(path.join(config.path, key), 'utf8', function (err,data) {

            if (err) {
                cb(err);
            }
            else {
                cb(null, data);
            }
        });

    };

    /**
     * Add method will save the value passed in to the file system. NOTE: This should only be sent strings.
     * @param key String value for the cache key
     * @param value String value to be cached
     * @param cb Callback to be called when operation is complete.
     */
    cache.add = function(key, value, cb){

        fs.writeFile(path.join(config.path, key), value, function (err) {
            if (err) {
                cb(err);
            }
            else {
                cb(null, true);
            }
        });

    };

    /**
     * Remove method will get rid of the cache key on the file system.
     * @param key String value for the cache key
     * @param cb Callback that gets called with the cached object is deleted.
     */
    cache.remove = function(key, cb){
        fs.unlink(path.join(config.path, key), function (err) {
            if (err) {
                cb(err, false);
            }
            else {
                cb(null, true);
            }
        });
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cache;
    }
})();