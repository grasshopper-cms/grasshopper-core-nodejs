/**
 * Middleware that will return a node by it's id. In addition to getting a single node you can also pass
 * in arguments that will return a node with it's children as well as a full tree.
 *
 * used arguments:  {id: id, includeChildren: includeChildren, deep: deep}
 *
 * kontx impact: adds the result of the call to the kontx.payload
 * result: makes db call to build the returned node object
 *
 * @param kontx
 * @param next
 */
module.exports = function getById(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db');

    db.nodes.getById(kontx.args.id).then(
        function(data){
            kontx.payload = data;
            next();
        },
        function(err){
            next(err);
        }).done();
};