/**
 * Middleware that creates a linkedIdentities array on the user, this array contains a string representing each identity the user has.
 *
 * @param kontx
 * @param next
 */

var _ = require('underscore');

module.exports = {
    create : create,
    update : update
};

function create(kontx, next){
    'use strict';

    var user = kontx.args[0];

    user.linkedIdentities = [];

    _.each(user.identities, function(value, key) {
        user.linkedIdentities.push(key);
    });

    kontx.args[0] = user;

    next();
}

function update(kontx, next) {
    'use strict';

    var user = kontx.args[0],
        newLinkedIdentities = user.linkedIdentities,
        existingIdentities = kontx.existingUser.linkedIdentities,
        difference;

    difference = _.union(_.difference(existingIdentities, newLinkedIdentities), _.difference(newLinkedIdentities, existingIdentities));

    if(!_.isEmpty(difference)) {
        _.each(difference, function(changedIdentitiy) {
            console.log(changedIdentitiy);
        });
    }

    next();
}