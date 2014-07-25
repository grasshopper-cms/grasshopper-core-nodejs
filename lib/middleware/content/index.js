var db = require('../../db');

module.exports.uniqueId = 'content';
module.exports.insert = require('../db')(db.content, db.content.insert);
module.exports.deleteById = require('../db')(db.content, db.content.deleteById);
module.exports.getById = require('../db')(db.content, db.content.getById);
module.exports.update = require('../db')(db.content, db.content.update);
module.exports.query = require('./query');
module.exports.prepareEvent = require('./prepareEvent');
module.exports.setTempContent = require('./setTempContent');
module.exports.setContentPayload = require('./setContentPayload');
module.exports.validate = require('./validate');
module.exports.setEventFiltersFromTempContent = require('./setEventFiltersFromTempContent');
module.exports.setComputedProperties = require('./setComputedProperties');
module.exports.convertType = require('./convertType');