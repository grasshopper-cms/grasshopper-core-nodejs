/**
 * Middleware that will rename an assets from one name to another name withing the same node.
 *
 * Ex: {nodeid: nodeid, original: original, updated: updated}
 *
 * @param kontx
 * @param next
 */
module.exports = function rename(kontx, next){
    'use strict';

    var assets = require('../../assets');

    assets.rename(kontx.args).then(
        function(payload){
            kontx.payload = payload;
            next();
        },
        function(err){
            next(err);
        }
    );
};