'use strict';

module.exports = function(db) {
    db.mongoose.connection.close();
};