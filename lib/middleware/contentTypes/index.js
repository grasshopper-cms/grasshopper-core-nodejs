var db = require('../../db')();

module.exports.uniqueId = 'contentTypes';
module.exports.insert = require('../db')(db.contentTypes, db.contentTypes.insert);
module.exports.deleteById = require('./deleteById');
module.exports.getById = require('../db')(db.contentTypes, db.contentTypes.getById);
module.exports.getBySlug = require('../db')(db.contentTypes, db.contentTypes.getBySlug);
module.exports.update = require('./update');
module.exports.list = require('../list')('contentTypes');
module.exports.setTypeCache = require('./setTypeCache');
module.exports.addFieldUid = require('./addFieldUid');