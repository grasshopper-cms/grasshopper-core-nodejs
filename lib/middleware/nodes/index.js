/**
 * Index of all node middlewares. The index exists so that we can easily import all of the node related
 * middleware with 1 require.
 */
module.exports.uniqueId = 'nodes';
module.exports.requireNodePermissions = require('./requireNodePermissions');
module.exports.setNodeIdFromArgument = require('./setNodeIdFromArgument');
module.exports.setNodeIdFromParentArgument = require('./setNodeIdFromParentArgument');
module.exports.getById = require('./getById');
module.exports.getBySlug = require('./getBySlug');
module.exports.deleteById = require('./deleteById');
module.exports.getChildren = require('./getChildren');
module.exports.insert = require('./insert');
module.exports.update = require('./update');
module.exports.saveContentTypes = require('./saveContentTypes');
module.exports.move = require('./move');
module.exports.permissionsMap = require('./permissionsMap');