require('chai').should();
'use strict';

describe('Grasshopper core - functional parts', function(){
    var grasshopper = require('../lib/grasshopper'),
        adminToken = "";

    before(function(done){

        grasshopper.configure(function(){
            this.config = {
                "crypto": {
                    "secret_passphrase" : "223fdsaad-ffc8-4acb-9c9d-1fdaf824af8c"
                },
                "db": {
                    "type": "mongodb",
                    "host": "mongodb://localhost:27017/test",
                    "database": "test",
                    "username": "",
                    "password": "",
                    "debug": false
                }
            };
        });


        grasshopper.auth('admin', 'TestPassword')
            .then(function(token){
                adminToken = token;
                done();
            });
    });

    describe('chain', function() {

        it('test', function(done) {

            grasshopper.use(adminToken)
                .users
                .getByEmail('apitestuser_1@thinksolid.com')
                .then(function(obj){
console.log(obj);
                    console.log('finished');
                    done();
                })
                .fail(function(err){
                    console.log(err);
                    done();
                });

        });
    });

});
