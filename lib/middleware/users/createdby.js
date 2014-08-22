/**
 * Middleware that creates a createdby object on the user. This object contains the id and displayname of the user creating the new user.
 *
 * @param kontx
 * @param next
 */

var _ = require('lodash');

module.exports = {
    create : create
};

function create(kontx, next){
    'use strict';

  console.log(kontx);

    next();
}