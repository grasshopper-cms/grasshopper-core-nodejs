/**
 * Middleware will take the currently saved  contentTypes and pass it to the modelCache module. The modelCache
 * is used to have handy access to content type models so that you don't need to go back to the database for them.
 *
 * @param kontx
 * @param next
 */
module.exports = function setTypeCache(kontx, next){
    'use strict';

    var cache = require('../../utils/modelCache');
    cache.set(cache.initByContentTypeId(kontx.payload._id));
    next();
};