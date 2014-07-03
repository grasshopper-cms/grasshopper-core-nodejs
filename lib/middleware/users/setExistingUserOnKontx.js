/**
 * Middleware that sets the existing user on the kontx obj, this is used for comparison with the updated user in other middleware.
 *
 * @param kontx
 * @param next
 */
module.exports = function setExistingUserOnKontx(kontx, next){
    'use strict';

    var db = require('../../db'),
        user = kontx.args[0],
        userId = user._id;

    db.users.getById(userId)
        .then(function(existingUser) {
            kontx.existingUser = existingUser;
        })
        .fail(next)
        .done(next);
};