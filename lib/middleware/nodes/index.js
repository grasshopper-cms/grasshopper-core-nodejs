/**
 * Index of all node middlewares. The index exists so that we can easily import all of the node related
 * middleware with 1 require.
 */
var db = require('../../db');

module.exports.uniqueId = 'nodes';
module.exports.requireNodePermissions = require('./requireNodePermissions');
module.exports.setNodeIdFromArgument = require('./setNodeIdFromArgument');
module.exports.setNodeIdFromParentArgument = require('./setNodeIdFromParentArgument');
module.exports.getById = require('../db')(db.nodes, db.nodes.getById);
module.exports.deleteById = require('./deleteById');
module.exports.getChildren = require('../db')(db.nodes, db.nodes.getByParent);
module.exports.insert = require('./insert');
module.exports.saveContentTypes = require('./saveContentTypes');
module.exports.permissionsMap = require('./permissionsMap');