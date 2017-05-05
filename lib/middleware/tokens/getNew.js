module.exports = function getNewToken (kontx, next) {
    'use strict';

    var uuid = require('node-uuid'),
        db = require('../../db')(),
        config = require('../../config'),
        crypto = require('../../utils/crypto'),
        type = kontx.args[0] !== undefined ? kontx.args[0] : 'basic',
        t = uuid.v4();

    db.tokens.insert({
        _id: crypto.createHash(t, config.crypto.secret_passphrase),
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
