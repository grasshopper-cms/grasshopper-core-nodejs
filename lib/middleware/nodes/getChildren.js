/**
 * Middleware that will return all of the children within a node. There is also an argument
 * that will return the children with all of their children.
 *
 * used arguments: {id: id, deep: deep}
 *
 * kontx impact: adds the result of the call to the kontx.payload
 * result: makes db call to attach contentTypes to a node
 *
 * @param kontx
 * @param next
 */
module.exports = function getChildren(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db');

    db.nodes.getByParent(kontx.args.id).then(
        function(data){
            kontx.payload = data;
            next();
        },
        function(err){
            next(err);
        }).done();
};