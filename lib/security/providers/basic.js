'use strict';
/**
 * User authentication model will authenticate the username and password in your database. If they are matching
 * then an auth token is created and returned. This token should be used for the remainder of your requests.
 */

var db = require('../../db'),
    BB = require('bluebird'),
    Strings = require('../../strings'),
    uuid  = require('node-uuid'),
    strings = new Strings('en');


module.exports = {
    auth: function(options){
        var err = new Error(strings.group('errors').invalid_username);
        err.code = strings.group('codes').unauthorized;
        return new BB(function(resolve, reject) {
            db.users
                .basicAuthentication(options.username, options.password)
                .then(function(user){
                    var t = uuid.v4();

                    db.tokens.insert({
                        _id: t,
                        uid: user._id,
                        created: new Date().toISOString(),
                        type:'basic'
                    })
                        .then(function(){
                            resolve(t);
                        });
                })
                .catch(function(){
                    reject(err);
                });
        });
    }
};

