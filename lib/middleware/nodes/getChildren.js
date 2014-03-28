/**
 * Middleware that will return all of the children within a node. There is also an argument
 * that will return the children with all of their children.
 *
 * used arguments: {id: id, deep: BOOL}
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
        db = require('../../db'),
        payload = [];

    //Recursive function to load children and save them into the payload
    function loadChild(node, cb){
        db.nodes.getByParent(node._id.toString()).then(
            function(data){
                payload = payload.concat(data);
                async.each(data, loadChild, cb);
            }).done();
    }

    //Initial callback that sets the payload and kicks off the recursive method if "deep" is set to true
    function setNodes(data){
        payload = data;

        if(kontx.args.deep === true){
            async.eachSeries(data, loadChild, sendNext);
        }
        else {
            sendNext();
        }
    }

    function sendError(err){
        next(err);
    }

    function sendNext(){
        kontx.payload = payload;
        next();
    }

    db.nodes.getByParent(kontx.args.id).then(setNodes, sendError).done();
};