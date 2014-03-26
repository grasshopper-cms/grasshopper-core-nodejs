var db = require('../../db');

module.exports.uniqueId = 'assets';
module.exports.copy = require('./copy');
module.exports.delete = require('./delete');
module.exports.deleteAll = require('./deleteAll');
module.exports.find = require('./find');
module.exports.list = require('./list');
module.exports.move = require('./move');
module.exports.rename = require('./rename');
module.exports.save = require('./save');