/**
 * Middleware that creates a linkedidentities array on the user, this array contains a string representing each identity the user has.
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

    var user = kontx.args[0];

    user.linkedidentities = _.keys(user.identities);

    kontx.args[0] = user;

    next();
}