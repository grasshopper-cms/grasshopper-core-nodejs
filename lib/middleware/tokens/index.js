var db = require('../../db')();

module.exports.uniqueId = 'tokens';
module.exports.deleteById = require('../db')(db.tokens, db.tokens.deleteById);
module.exports.getNew = require('./getNew');
module.exports.impersonate = require('./impersonate');