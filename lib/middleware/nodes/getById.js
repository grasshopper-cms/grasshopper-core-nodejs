/**
 * Middleware that will return a node by it's id. In addition to getting a single node you can also pass
 * in arguments that will return a node with it's children as well as a full tree.
 *
 * used arguments:  {id: id}
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
        db = require('../../db'),
        payload = {};

    function setNode(data){
        payload = data;
        sendNext();
    }

    function sendError(err){
        next(err);
    }

    function sendNext(){
        kontx.payload = payload;
        next();
    }

    // [TODO] Need to support deep loading nodes, and flat nodes
    db.nodes.getById(kontx.args.id).then(setNode, sendError).done();
};