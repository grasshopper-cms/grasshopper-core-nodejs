module.exports = function setEventFiltersFromTempContent(kontx, next){
    'use strict';

    var logger = require('../../utils/logger');

    kontx.event.filter.contentid = kontx._content._id.toString();
    kontx.event.filter.type = kontx._content.type.toString();
    kontx.event.filter.node = kontx._content.node._id.toString();

    logger.trace('kontx event', kontx.event);
    next();
};