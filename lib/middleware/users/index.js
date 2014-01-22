var db = require('../../db'),
    _  = require('underscore');

module.exports.uniqueId = 'users';
module.exports.authenticate = require('../db')(db.users, db.users.authenticate);
module.exports.create = require('../db')(db.users, db.users.create);
module.exports.deleteById = require('../db')(db.users, db.users.deleteById);
module.exports.disable = require('./disable');
module.exports.enable = require('./enable');
module.exports.getByEmail = require('../db')(db.users, db.users.getByEmail);
module.exports.getByLogin = require('../db')(db.users, db.users.getByLogin);
module.exports.getById = require('../db')(db.users, db.users.getById);
module.exports.query = require('../db')(db.users, db.users.query);
module.exports.update = require('../db')(db.users, db.users.update);
module.exports.savePermissions = require('../db')(db.users, db.users.savePermissions);