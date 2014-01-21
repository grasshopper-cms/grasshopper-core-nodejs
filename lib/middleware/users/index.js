var db = require('../../db');

module.exports.authenticate = require('./authenticate');
module.exports.create = require('./create');
module.exports.deleteById = require('./deleteById');
module.exports.disable = require('./disable');
module.exports.enable = require('./enable');
module.exports.getByEmail = require('../db')(db.users, db.users.getByEmail);
module.exports.getByLogin = require('../db')(db.users, db.users.getByLogin);
module.exports.getById = require('./getById');
module.exports.query = require('./query');
module.exports.update = require('./update');
module.exports.updatePermission = require('./updatePermission');