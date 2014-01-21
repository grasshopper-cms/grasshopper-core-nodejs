var users = function(kontx) {
    'use strict';

    var coordinator = require('./coordinator'),
        middleware = require('./middleware');

    coordinator.use('users.getByEmail',[
        middleware.identity
    ]);

    return {
        getByEmail: function(email){
            kontx.email = email;
            return coordinator.handle('users.getByEmail', kontx);
        },
        create: function(userObj){


        }
    };
};

module.exports = users;