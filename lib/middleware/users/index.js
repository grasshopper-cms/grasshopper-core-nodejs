var db = require('../../db')();

module.exports.uniqueId = 'users';
module.exports.insert = require('../db')(db.users, db.users.insert);
module.exports.deleteById = require('../db')(db.users, db.users.deleteById);
module.exports.getByEmail = require('../db')(db.users, db.users.getByEmail);
module.exports.getBySlug = require('../db')(db.users, db.users.getBySlug);
module.exports.getById = require('../db')(db.users, db.users.getById);
module.exports.update = require('./update');
module.exports.list = require('../list')('users');
module.exports.savePermissions = require('../db')(db.users, db.users.savePermissions);
module.exports.deletePermissions = require('../db')(db.users, db.users.deletePermissions);
module.exports.validate = require('./validate');
module.exports.parse = require('./parse');
module.exports.linkedidentities = require('./linkedidentities');
module.exports.getIdentity = require('../db')(db.users, db.users.getIdentity);
module.exports.linkIdentity = require('../db')(db.users, db.users.linkIdentity);
module.exports.unLinkIdentity = require('../db')(db.users, db.users.unLinkIdentity);
