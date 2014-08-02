/**
 * Module can look at the argument sent to the coordinator and pluck out the node id that was passed in.
 *
 * kontx impact: Adds a _content.node._id property that can be used later to evaluate the content's parent node.
 * result: adds a property to the kontx
 */
module.exports = function setNodeIdFromParentArgument(kontx, next){
    'use strict';

    var _ = require('lodash');

    kontx._content = {};
    kontx._content.meta = {};
    kontx._content.meta.node = '';

    //Check to see if a node id is passed in as an object or assume it is the ID that is supplied.
    if(!_.isNull(kontx.args.parent)){
        kontx._content.meta.node = kontx.args.parent;
    }

    next();
};