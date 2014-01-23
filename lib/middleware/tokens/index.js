var db = require('../../db'),
    _  = require('underscore');

module.exports.uniqueId = 'tokens';
module.exports.create = require('../db')(db.tokens, db.tokens.create);
module.exports.deleteById = require('../db')(db.tokens, db.tokens.deleteById);
module.exports.getById = require('../db')(db.tokens, db.tokens.getById);
module.exports.validate = require('./validate');
module.exports.getNew = require('./getNew');