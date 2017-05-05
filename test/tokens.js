'use strict';
var should = require('chai').should(),
    path = require('path'),
    grasshopper,
    db,
    start = require('./_start'),
    crypto = require('../lib/utils/crypto');

describe('Grasshopper core - testing tokens', function(){
    var adminToken = '',
        readerToken = '',
        readerToken2 = '',
        readerToken3 = '',
        userId = '5245ce1d56c02c066b000001';

    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            // db is only setup after gh is initialized
            db = require('../lib/db')();

            grasshopper.auth('basic', { username: 'admin', password: 'TestPassword' }).then(function(token){
                adminToken = token;
                grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                    readerToken = token;
                    grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                        readerToken2 = token;
                        grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                            readerToken3 = token;
                            done();
                        });
                    });
                });
            });
        });
    });

    after(function(){
        this.timeout(10000);
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

    describe('tokens.deleteByUserIdAndType', function(){
        var testUser;

        beforeEach(function(done) {
            var newUser = {
                role: 'reader',
                identities: {
                    basic: {
                        username: 'newtestuserTOKEN',
                        password: 'TestPassword'
                    }
                },
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(userObj){
                    testUser = userObj;
                    grasshopper.auth('basic', { username: 'newtestuserTOKEN', password: 'TestPassword' })
                        .then(function(){
                            db.tokens.insert({
                                _id: '7236987623876243987623487964',
                                uid: testUser._id,
                                created: new Date().toISOString(),
                                type:'google'
                            })
                            .done(function(){
                                    done();
                                });
                        });
                })
                .fail(doneError.bind(done))
                .done();
        });

        afterEach(function(done) {
            grasshopper.request(adminToken).users.deleteById(testUser._id)
                .done(function() {
                    testUser = null;
                    done();
                });
        });

        describe('a user with a created token', function() {
            it('should delete only the specified type of token', function(done){
                db.tokens.deleteByUserIdAndType(testUser._id, 'basic')
                    .then(function(){
                        db.tokens.findByUserId(testUser._id)
                            .then(function(payload){
                                payload[0].type.should.equal('google');
                                done();
                            })
                            .fail(doneError.bind(done))
                            .catch(doneError.bind(done))
                            .done();

                    })
                    .fail(doneError.bind(done))
                    .catch(doneError.bind(done))
                    .done();
            });
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

        it('should add the type onto the token', function(done){
            grasshopper.request(adminToken).tokens.getNew('google')
                .then(function(payload){
                    var token = crypto.createHash(payload, grasshopper.config.crypto.secret_passphrase);

                    db.tokens.getById(token)
                        .then(function(tokenObj){
                                tokenObj.should.have.property('type');
                                tokenObj.type.should.equal('google');
                                done();
                            })
                        .fail(doneError.bind(done))
                        .catch(doneError.bind(done))
                        .done();
                })
                .fail(doneError.bind(done))
                .catch(doneError.bind(done))
                .done();
        });

        it('should default to basic if no type is passed in', function(done){
            grasshopper.request(adminToken).tokens.getNew()
                .then(function(payload){
                    var token = crypto.createHash(payload, grasshopper.config.crypto.secret_passphrase);

                    db.tokens.getById(token)
                        .then(function(tokenObj){
                            tokenObj.should.have.property('type');
                            tokenObj.type.should.equal('basic');
                            done();
                        })
                        .fail(doneError.bind(done))
                        .catch(doneError.bind(done))
                        .done();
                })
                .fail(doneError.bind(done))
                .catch(doneError.bind(done))
                .done();
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

    function getConfig(){
        return {
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
    }

    function doneError(done, err) {
        done(err);
    }

});
