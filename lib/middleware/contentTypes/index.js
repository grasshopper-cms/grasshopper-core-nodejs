var db = require('../../db');

module.exports.uniqueId = 'contentTypes';
module.exports.create = require('../db')(db.contentTypes, db.contentTypes.create);
module.exports.deleteById = require('../db')(db.contentTypes, db.contentTypes.deleteById);
module.exports.getById = require('../db')(db.contentTypes, db.contentTypes.getById);
module.exports.query = require('../db')(db.contentTypes, db.contentTypes.query);
module.exports.update = require('../db')(db.contentTypes, db.contentTypes.update);
module.exports.list = require('../list')('contentTypes');