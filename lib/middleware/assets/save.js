/**
 * Middleware that save an asset to a node
 *
 * Ex: {nodeid: nodeid, filename: filename, path: path}
 *
 * @param kontx
 * @param next
 */
module.exports = function save(kontx, next){
    'use strict';

    var assets = require('../../assets');

    assets.save(kontx.args).then(
        function(payload){
            kontx.payload = payload;
            next();
        },
        function(err){
            next(err);
        }
    );

};