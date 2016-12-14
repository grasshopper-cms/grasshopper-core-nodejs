'use strict';

var db = require('../../db')(),
    createDbMiddleware = require('../db');

module.exports.uniqueId = 'content';
module.exports.insert = createDbMiddleware(db.content, db.content.insert);
module.exports.populateAll = require('./populateAll');
module.exports.deleteById = createDbMiddleware(db.content, db.content.deleteById);
module.exports.update = createDbMiddleware(db.content, db.content.update);
module.exports.query = require('./query');
module.exports.prepareEvent = require('./prepareEvent');
module.exports.setTempContent = require('./setTempContent');
module.exports.setContentPayload = require('./setContentPayload');
module.exports.validate = require('./validate');
module.exports.setEventFiltersFromTempContent = require('./setEventFiltersFromTempContent');
module.exports.setComputedProperties = require('./setComputedProperties');
module.exports.convertType = require('./convertType');