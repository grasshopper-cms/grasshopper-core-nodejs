module.exports = function getNewToken (kontx, next) {
    'use strict';

    var uuid = require('node-uuid'),
        db = require('../../db'),
        type = kontx.args[0] !== undefined ? kontx.args[0] : 'basic',
        t = uuid.v4();

    db.tokens.insert({
        _id: t,
        uid: kontx.user._id,
        created: new Date().toISOString(),
        type: type
    }).then(function () {
        kontx.payload = t;
        next();
    }).fail(function (err) {
        next(err);
    }).done();
};

