/**
 * Middleware that will update a node int the system.
 *
 * args: complete node object
 *
 * kontx impact: adds the result of the call to the kontx.payload
 * result: makes db call to update node
 *
 * @param kontx
 * @param next
 */
module.exports = function update(kontx, next){
    'use strict';

    var async = require('async'),
        db = require('../../db')();

    db.nodes.update(kontx.args).then(
        function(val){
            kontx.payload = val;
            next();
        },
        function(err){
            next(err);
        }).done();

};