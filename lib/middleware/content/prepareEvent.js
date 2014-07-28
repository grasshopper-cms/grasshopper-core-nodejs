module.exports = function prepareEvent(kontx, next){
    'use strict';

    var _ = require('lodash'),
        logger = require('../../utils/logger');

    if ( !_.isUndefined( kontx.args.meta ) && !_.isUndefined( kontx.args.meta.type ) ){
        kontx.event.filter.type =  kontx.args.meta.type.toString();
    }

    if ( !_.isUndefined( kontx.args.meta ) && !_.isUndefined(kontx.args.meta.node) ) {
        kontx.event.filter.node = kontx.args.meta.node.toString();
    }

    if ( !_.isUndefined( kontx.args._id ) ) {
        kontx.event.filter.contentid = kontx.args._id.toString();
    }

    next();
};