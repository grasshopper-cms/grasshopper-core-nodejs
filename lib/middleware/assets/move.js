/**
 * Middleware that will move one asset from one node to another
 *
 * Ex: {nodeid: nodeid, newnodeid: newnodeid, filename: filename}
 *
 * @param kontx
 * @param next
 */
module.exports = function move(kontx, next){
    'use strict';


    next();
};