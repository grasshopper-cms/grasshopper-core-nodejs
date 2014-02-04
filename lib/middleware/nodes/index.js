var db = require('../../db');

module.exports.uniqueId = 'nodes';

module.exports.requireNodePermissions = require('./requireNodePermissions');
module.exports.setNodeIdFromArgument = require('./setNodeIdFromArgument');
module.exports.setNodeIdFromParentArgument = require('./setNodeIdFromParentArgument');
module.exports.getById = require('../db')(db.nodes, db.nodes.getById);
module.exports.insert = require('./insert');