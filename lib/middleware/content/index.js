var db = require('../../db');

module.exports.uniqueId = 'content';
module.exports.create = require('../db')(db.content, db.content.create);
module.exports.deleteById = require('../db')(db.content, db.content.deleteById);
module.exports.getById = require('../db')(db.content, db.content.getById);
module.exports.update = require('../db')(db.content, db.content.update);
module.exports.query = require('../db')(db.content, db.content.query);