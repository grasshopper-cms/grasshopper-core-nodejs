var db = require('../../db');

module.exports.uniqueId = 'users';
module.exports.authenticate = require('../db')(db.users, db.users.authenticate);
module.exports.insert = require('../db')(db.users, db.users.insert);
module.exports.deleteById = require('../db')(db.users, db.users.deleteById);
module.exports.getByEmail = require('../db')(db.users, db.users.getByEmail);
module.exports.getByLogin = require('../db')(db.users, db.users.getByLogin);
module.exports.getById = require('../db')(db.users, db.users.getById);
module.exports.query = require('./query');
module.exports.update = require('./update');
module.exports.list = require('../list')('users');
module.exports.savePermissions = require('../db')(db.users, db.users.savePermissions);
module.exports.deletePermissions = require('../db')(db.users, db.users.deletePermissions);
module.exports.validate = require('./validate');