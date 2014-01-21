var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

require('chai').should();

describe('Grasshopper core - users', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper'),
        adminToken = "",
        readerToken = "";

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
                grasshopper.auth('apitestuserreader', 'TestPassword')
                    .then(function(token){
                        readerToken = token;
                        done();
                    });
            });
    });


    it('Make sure that a reader cannot call getByEmail method (only admins can)', function(done) {
        grasshopper.run(readerToken)
            .users
            .getByEmail('apitestuser_1@thinksolid.com')
            .should.eventually.be.rejected.notify(done);
    });

    it('Make sure that admin can get a user by it\'s email address.', function(done) {
        grasshopper.run(adminToken)
            .users
            .getByEmail('apitestuser_1@thinksolid.com')
            .should.eventually.be.fulfilled.notify(done);
    });

});
