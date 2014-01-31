/**
 * Module can look at the argument sent to the coordinator and pluck out the node id that was passed in.
 * @param requiredRole
 */
module.exports = function setNodeIdFromArgument(kontx, next){
    'use strict';

    kontx._content = {};
    kontx._content.node = {};
    kontx._content.node._id = '';

    if(kontx.args.node && kontx.args.node._id){
        kontx._content.node._id = kontx.args.node._id;
    }

    next();
};