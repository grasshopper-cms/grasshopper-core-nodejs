'use strict';

var runner = {},
    _ = require('underscore'),
    q = require('q'),
    roles = require('../security/roles');


runner.requires = function(role){


    return {
        setUser: function(user){
            console.log(user);
            var userRole = roles[user.role.toUpperCase()],
                hasPermission = (userRole <= parseInt(role, 10));

            return {
                exec: function(func, args){
                    console.log(this);
                    var err;

                    if(hasPermission){
                        return func.apply(this, args);
                    }
                    else {
                        err = new Error();
                        err.errorCode = 403;
                        return null;
                    }
                }
            };
        }
    };
};

module.exports = runner;