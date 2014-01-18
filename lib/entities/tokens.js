/**
 * Tokens are used to send back a generic key that indicates that you have been logged in in the past. Having a valid
 * token means that once you log in, through the application you will not have to do it again unless the tokens have
 * been revoked or expired. This is handy when you have to do many operations at once. You would just log in, get a token
 * and send the token around to ensure that you have access to the system.
 * @type {tokens}
 */
(function(){
    "use strict";

    var self = {},
        crypto = require("../utils/crypto"),
        db = require("../db");

    self.getById = function(token){
        return db.tokens.getById(token);
    };

    self.deleteById = function(token){
        return db.tokens.deleteById(token);
    };

    self.create = function(token, profile){
        return db.tokens.create({
            _id: token,
            uid: profile._id.toString(),
            created: new Date().toISOString()
        });
    };

    module.exports = self;
})();