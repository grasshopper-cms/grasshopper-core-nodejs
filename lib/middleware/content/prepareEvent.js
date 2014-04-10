module.exports = function prepareEvent(kontx, next){
    'use strict';

    var _ = require('underscore'),
        logger = require('../../utils/logger');

    if ( !_.isUndefined( kontx.args.type ) ){
        kontx.event.filter.type =  kontx.args.type;
    }

    if ( !_.isUndefined(kontx.args.node) ) {
        kontx.event.filter.node = kontx.args.node._id;
    }

    if ( !_.isUndefined( kontx.args._id ) ) {
        kontx.event.filter.contentid = kontx.args._id;
    }

    logger.trace('kontx event', kontx.event);
    next();
};