var should = require('chai').should();

describe('Grasshopper core - testing tokens', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper'),
        path = require('path'),
        adminToken = '',
        readerToken = '',
        readerToken2 = '',
        readerToken3 = '',
        userId = '5245ce1d56c02c066b000001';

    before(function(done){

        grasshopper.configure(function(){
            this.config = {
                'crypto': {
                    'secret_passphrase' : '223fdsaad-ffc8-4acb-9c9d-1fdaf824af8c'
                },
                'db': {
                    'type': 'mongodb',
                    'host': 'mongodb://localhost:27017/test',
                    'database': 'test',
                    'username': '',
                    'password': '',
                    'debug': false
                },
                'assets': {
                    'default' : 'local',
                    'tmpdir' : path.join(__dirname, 'tmp'),
                    'engines': {
                        'local' : {
                            'path' : path.join(__dirname, 'public'),
                            'urlbase' : 'http://localhost'
                        }
                    }
                }
            };
        });

        grasshopper.auth('basic', { username: 'admin', password: 'TestPassword' }).then(function(token){
                adminToken = token;
                console.log(token);
                grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                        readerToken = token;
                        grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                            readerToken2 = token;
                            grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                                readerToken3 = token;
                                done();
                            });
                        });
                    })
                    .fail(function(err) {
                        console.log(err);
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
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('a user has to have a valid auth token to use token.deleteById function.', function(done){
            grasshopper.request('12345678989').tokens.deleteById(readerToken).then(
                function(){
                    throw new Error('Payload should be null');
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('an administrator (only) should be able to delete any token that is not their own.', function(done) {
            grasshopper.request(adminToken).tokens.deleteById(readerToken).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('a user should not be able to delete a token that is not their own.', function(done) {
            grasshopper.request(readerToken2).tokens.deleteById(adminToken).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('a user should be able to authenticate then log themselves out.', function(done) {
            grasshopper.request(readerToken2).tokens.deleteById(readerToken2).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('a user should be able to authenticate then log themselves out using a convenience "logout" method.', function(done) {
            grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' }).then(
                function(token){
                    grasshopper.request(token).tokens.logout().then(
                        function(payload){
                            payload.should.equal('Success');
                        },
                        function(err){
                            should.not.exist(err);
                        }
                    ).done(done);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done();
        });
    });

    describe('tokens.getNew', function(){

        it('a user should be able to create a new version of their token that they can use elsewhere', function(done) {
            grasshopper.request(readerToken3).tokens.getNew().then(
                function(payload){
                    payload.should.be.string;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('if a user is currently not logged in then they should receive a 401 error.', function(done){
            grasshopper.request().tokens.getNew().then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });
    });


    describe('tokens.impersonate', function(){

        it('as an adminsitrator I should be able to impersonate another user.', function(done) {
            grasshopper.request(adminToken).tokens.impersonate(userId).then(
                function(payload){
                    payload.length.should.be.greaterThan(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('as a user that in not an administrator I should not be able to impersonate anyone.', function(done) {
            grasshopper.request(readerToken3).tokens.impersonate(userId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

    });
});
