module.exports = function impersonate(kontx, next){
    'use strict';

    var uuid  = require('node-uuid'),
        db = require('../../db')(),
        config = require('../../config'),
        crypto = require('../../utils/crypto'),
        t = uuid.v4();

    db.tokens.insert({
        _id: crypto.createHash(t, config.crypto.secret_passphrase),
        uid: kontx.args[0],
        created: new Date().toISOString()
    }).then(function(){
        kontx.payload = t;
        next();
    }).fail(function(err){
        next(err);
    }).done();
};
