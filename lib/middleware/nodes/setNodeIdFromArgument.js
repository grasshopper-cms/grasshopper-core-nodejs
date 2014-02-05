/**
 * Module can look at the argument sent to the coordinator and pluck out the node id that was passed in.
 */
module.exports = function setNodeIdFromArgument(kontx, next){
    'use strict';

    kontx._content = {};
    kontx._content.node = {};
    kontx._content.node._id = '';

    //Check to see if a node id is passed in as an object or assume it is the ID that is supplied.
    if(kontx.args.node && kontx.args.node._id){
        kontx._content.node._id = kontx.args.node._id;
    }
    else if(kontx.args.nodeid){
        kontx._content.node._id = kontx.args.nodeid;
    }
    else {
        kontx._content.node._id = kontx.args[0];
    }

    next();
};