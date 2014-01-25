require('chai').should();

describe('Grasshopper core - testing tokens', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper'),
        adminToken = '',
        readerToken = '';

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


        grasshopper.auth('admin', 'TestPassword').then(function(token){
                adminToken = token;
                grasshopper.auth('apitestuserreader', 'TestPassword').then(function(token){
                        readerToken = token;
                        done();
                    });
            });
    });

    describe('tokens.deleteById', function(){

        it('a user has to be logged in to use tokens.deleteById function.', function(done) {
            grasshopper.request().tokens.deleteById(readerToken).then(
                function(){
                    throw new Error('Payload should be null');
                },
                function(err){
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('a user has to have a valid auth token to use token.deleteById function.', function(done){
            grasshopper.request('12345678989').tokens.deleteById(readerToken).then(
                function(){
                    throw new Error('Payload should be null');
                },
                function(err){
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('an administrator (only) should be able to delete any token that is not their own.', function(done) {
            true.should.equal(false);
            done();
        });

        it('a user should not be able to delete a token that is not their own.', function(done) {
            grasshopper.request(readerToken).tokens.deleteById(adminToken).then(
                function(){
                    throw new Error('Payload should be null');
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);


        });

        it('a user should be able to authenticate then log themselves out.', function(done) {
            true.should.equal(false);
            done();
        });

    });

    describe('tokens.getNew', function(){

        it('a user should be able to create a new version of their token that they can use elsewhere', function(done) {
            true.should.equal(false);
            done();
        });

        it('if a user is currently not logged in then they should receive a 401 error.', function(done){
            true.should.equal(false);
            done();
        });
    });


    describe('tokens.impersonate', function(){

        it('as an adminsitrator I should be able to impersonate another user.', function(done) {
            true.should.equal(false);
            done();
        });

        it('as a user that in not an administrator I should not be able to impersonate anyone.', function(done) {
            true.should.equal(false);
            done();
        });

    });
});
