/**
 * Module can look at the argument sent to the coordinator and pluck out the node id that was passed in.
 */
module.exports = function setNodeIdFromParentArgument(kontx, next){
    'use strict';

    var _ = require('underscore');

    kontx._content = {};
    kontx._content.node = {};
    kontx._content.node._id = '';

    //Check to see if a node id is passed in as an object or assume it is the ID that is supplied.
    if(!_.isNull(kontx.args.parent)){
        kontx._content.node._id = kontx.args.parent;
    }
    else {
        kontx._content.node._id = '';
    }

    next();
};