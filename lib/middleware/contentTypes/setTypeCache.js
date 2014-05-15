/**
 * Middleware will take the currently saved contentType and pass it to the typeCache module. The typeCache
 * is used to have handy access to content types so that you don't need to go back to the database for them.
 *
 * @param kontx
 * @param next
 */
module.exports = function setTypeCache(kontx, next){
    'use strict';

    var cache = require('../../utils/typeCache');
    cache.set(kontx.payload);
    next();
};