/**
 * When a piece of content is saved we need to set all of the computed values (meta) information
 * setting this information goes beyond a simple saving to the db.
 *
 * @param kontx
 * @param next
 */
module.exports = function setComputedProperties(kontx, next){
    'use strict';

    var _ = require('lodash'),
        typeCache = require('../../utils/typeCache');

    kontx.args.meta.labelfield = _.first( typeCache.get( kontx.args.meta.type ).fields )._id.toString();
    kontx.args.meta.typelabel = typeCache.get( kontx.args.meta.type ).label;
    kontx.args.meta.lastmodified = new Date();
    next();
};