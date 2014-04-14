/**
 * When a piece of content is saved we need to set all of the computed values (meta) information
 * setting this information goes beyond a simple saving to the db.
 *
 * @param kontx
 * @param next
 */
module.exports = function setComputedProperties(kontx, next){
    'use strict';

    var _ = require('underscore'),
        typeCache = require('../../utils/typeCache');

    kontx.args.meta.labelfield = _.first( typeCache.get( kontx.args.meta.type ).fields ).id.toString();
    kontx.args.meta.lastmodified = new Date();
    next();
};