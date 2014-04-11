/**
 * Module can look at the argument sent to the coordinator and pluck out the node id that was passed in.
 *
 * kontx impact: Adds a _content.node._id property that can be used later to evaluate the content's node.
 * result: adds a property to the kontx
 */
module.exports = function setNodeIdFromArgument(kontx, next){
    'use strict';

    kontx._content = {};
    kontx._content.meta = {};
    kontx._content.meta.node = {};
    kontx._content.meta.node = '';

    //Check to see if a node id is passed in as an object or assume it is the ID that is supplied.
    if(kontx.args.meta && kontx.args.meta.node){
        kontx._content.meta.node = kontx.args.meta.node;
    }
    else if(kontx.args.id){
        kontx._content.meta.node = kontx.args.id;
    }
    else if(kontx.args.nodeid) {
        kontx._content.meta.node = kontx.args.nodeid;
    }
    else {
        kontx._content.meta.node = kontx.args[0];
    }

    next();
};