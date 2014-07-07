var chai = require('chai'),
    should = require('chai').should();

describe('Grasshopper core - users', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper'),
        path = require('path'),
        async = require('async'),
        testUserId  = '5245ce1d56c02c066b000001',
        adminToken = '',
        admin2UserId = '5246e73d56c02c0744000004',
        testReaderUserId = '5246e80c56c02c0744000002',
        testNodeForPermissions = '5261781556c02c072a000007',
        testSubNodeForPermissions = '526417710658fc1f0a00000b',
        readerToken = '',
        testCreatedUserId = ''  ,
        testCreatedUserIdCustomVerb = '';

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

        grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' })
            .then(function(token){
                adminToken = token;
                grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' })
                    .then(function(token){
                        readerToken = token;
                        done();
                    },
                function(err){
                    console.log(err);
                });
            });
    });

    describe('Get a user by email', function(){
        it('Make sure that a reader cannot call getByEmail method (only admins can)', function(done) {
            grasshopper.request(readerToken)
                .users
                .getByEmail('apitestuser_1@thinksolid.com')
                .then(function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }).done(done);

        });

        it('Make sure that admin can get a user by it\'s email address.', function(done) {
            grasshopper.request(adminToken)
                .users
                .getByEmail('apitestuser_1@thinksolid.com')
                .then(function(payload){
                    payload.email.should.equal('apitestuser_1@thinksolid.com');
                },function(err){
                    should.not.exist(err);
                })
                .done(done);
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getByEmail('test@test.com')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.code.should.equal(401);
                }).done(done);
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getByEmail('test@test.com')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.code.should.equal(404);
                }).done(done);
        });
    });

    describe('Get a user by id', function() {
        it('Make sure that a reader cannot call getById method (only admins can)', function(done) {
            grasshopper.request(readerToken)
                .users
                .getById('5246e73d56c02c0744000004')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.code.should.equal(403);
                }).done(done);

        });

        it('Make sure that admin can get a by getById', function(done) {
            grasshopper.request(adminToken)
                .users
                .getById('5246e73d56c02c0744000004')
                .then(function(payload){
                    payload.email.should.equal('apitestuser@thinksolid.com');
                },function(err){
                    should.not.exist(err);
                }).done(done);
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getById('5246e73d56c02c0744000004')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.code.should.equal(401);
                }).done(done);
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getById('526417710658fc1f0a00000b')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.code.should.equal(404);
                }).done(done);
        });
    });

    describe('Get info about the current logged in user', function() {
        it('should return the current logged in user', function(done) {
            grasshopper.request(readerToken).users.current().then(
                function(payload){
                    payload.email.should.equal('apitestuser@thinksolid.com');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return a 401 because user is not authenticated', function(done) {
            grasshopper.request().users.current().then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });
    });

    describe('Get user list', function() {
        it('should return a list of users with the default page size', function(done) {
            grasshopper.request(adminToken).users.list().then(
                function(payload){
                    payload.results.length.should.equal(7);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should a list of users with the specified page size', function(done) {
            grasshopper.request(adminToken).users.list({limit:1}).then(
                function(payload){
                    payload.results.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return a 403 because user does not have permissions to access users', function(done) {
            grasshopper.request(readerToken).users.list().then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return an empty list if the page size and current requested items are out of bounds.', function(done) {
            grasshopper.request(adminToken).users.list({limit:10, skip: 30}).then(
                function(payload){
                    payload.results.length.should.equal(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return a 401 because user is not authenticated', function(done) {
            grasshopper.request().users.list().then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });
    });

    describe('insert a new user', function() {
        it('should error out because user does not have enough permissions to insert a user.', function(done){
            grasshopper.request(readerToken)
                .users
                .insert({})
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.code.should.equal(403);
                }).done(done);
        });

        it('should insert a user without an error.', function(done){
            var newUser = {
                role: 'reader',
                identities: {
                    basic: {
                        login: 'newtestuser1',
                        password: 'TestPassword'
                    }
                },
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };

            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    payload.identities.basic.login.should.equal(newUser.identities.basic.login);
                    payload.should.have.property('_id');
                    payload.identities.basic.should.not.have.property('password');
                    payload.should.have.property('linkedIdentities');
                    testCreatedUserId = payload._id;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should insert a user without an error with additional custom params.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'newtestuser2',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    payload.identities.basic.login.should.equal(newUser.identities.basic.login);
                    payload.should.have.property('_id');
                    payload.should.not.have.property('password');
                    payload.identities.basic.should.not.have.property('password');
                    testCreatedUserIdCustomVerb = payload._id;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should insert a new with a linked identities array representing all linked identities', function(done) {
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'somePerson',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    payload.should.have.property('linkedIdentities');
                    payload.linkedIdentities[0].should.equal('basic');
                },
                function(err){
                    should.not.exist(err);
                })
                .done(done);
        });

        it('Freshly Inserted user, Should not have a google property on identities.', function(done) {
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'someOtherPerson',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    payload.identities.should.not.have.property('google');
                },
                function(err){
                    should.not.exist(err);
                })
                .done(done);
        });

        it('should return error if a an existing user id is sent with the request.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser2@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'newtestuser11111',
                        password: 'TestPassword'
                    }
                }
            };

            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Duplicate key already exists.');
                }
            ).done(done);
        });

        it('should return error if a duplicate is created.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'newtestuser1',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('This login is already in use.');
                }
            ).done(done);
        });

        it('should validate and return error if a mandatory property is missing.',function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('login is required.');
                }
            ).done(done);
        });

        it('should return error if an empty login is provided.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: '',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('login is required.');
                }
            ).done(done);
        });

        it('should return error if an null login is provided.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: null,
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('login is required.');
                }
            ).done(done);
        });

        it('should return error if a login is too short.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'sho',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Your login is too short.');
                }
            ).done(done);
        });

        it('should return error if a password is null.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'newtestuserunique',
                        password: null
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Password must be at least 6 characters.');
                }
            ).done(done);
        });

        it('should return error if a password is too short.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'newtestuserunique',
                        password: 'sho'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Password must be at least 6 characters.');
                }
            ).done(done);
        });

        it('should return error if a user has a role that is not allowed.', function(done){
            var newUser = {
                role: 'fake role',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        login: 'newtestuserunique',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('User\'s role is invalid.');
                }
            ).done(done);
        });
    });

    describe('Update a user', function() {
        it('should return a 401 because user is not authenticated.', function(done){
            grasshopper.request().users.update({}).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        login: 'newtestuser1',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(readerToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                    err.message.should.equal('User does not have enough privileges.');
                }
            ).done(done);
        });

        // This test is buggy, If you console.log the user, Identities object is squashed.
        xit('should update a user', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        login: 'newtestuser1_updated'
                    }
                },
                role: 'reader',
                linkedIdentities: ['basic'],
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    payload.identities.basic.login.should.equal(newUser.identities.basic.login);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        describe('with changes in the identities', function() {

            it('should update the linked identities when linking a new identity', function(done) {
                var googleOptions = {
                        duder : true
                    };

                grasshopper.request(adminToken).users.linkIdentity(testCreatedUserId, 'google', googleOptions)
                    .then(function(payload){
                        payload.should.equal('Success');

                        grasshopper.request(adminToken).users.getById(testCreatedUserId)
                            .then(function(payload) {
                                payload.linkedIdentities.should.deep.equal(['basic', 'google']);
                            })
                            .fail(function(err) {
                                should.not.exist(err);
                            })
                            .done(done);

                    })
                    .fail(function(err){
                        should.not.exist(err);
                    })
                    .done();
            });

            it('should unlink identities when calling unlink', function(done) {
                grasshopper.request(adminToken).users.unLinkIdentity(testCreatedUserId, 'google')
                    .then(function(payload){
                        payload.should.equal('Success');

                        grasshopper.request(adminToken).users.getById(testCreatedUserId)
                            .then(function(payload) {
                                payload.linkedIdentities.should.deep.equal(['basic']);
                            })
                            .fail(function(err) {
                                should.not.exist(err);
                            })
                            .done(done);

                    })
                    .fail(function(err){
                        should.not.exist(err);
                    })
                    .done();
            });

        });

        describe('admin should be able to change a user\'s password', function(){
            var token,
                error;

            before(function (done) {
                function getTestUser(next){
                    grasshopper.request(adminToken).users.getById(testReaderUserId).then(
                        function(payload){
                            next(null, payload);
                        },
                        function(err){
                            next(err);
                        }
                    ).done();
                }

                function updateUser(user, next){
                    user.identities.basic.password = 'thisismytestpassword';

                    grasshopper.request(adminToken).users.update(user).then(
                        function(){
                            next();
                        },
                        function(err){
                            next(err);
                        }
                    ).done();
                }

                function tryUseOldLogin(next){
                    grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' }).then(
                        function(token){
                            next(should.not.exist(token));
                        },
                        function(){
                            next();
                        });
                }

                function tryUseNewLogin(next){
                    grasshopper.auth('username', { username: 'apitestuserreader', password: 'thisismytestpassword' }).then(
                        function(token){
                            next(null, token);
                        },
                        function(err){
                            next(err);
                        });
                }

                function complete(err, result) {
                    error = err;
                    token = result;
                    done();
                }

                async.waterfall([getTestUser, updateUser, tryUseOldLogin, tryUseNewLogin],complete);
            });

            it('no error should be thrown', function(){
                should.not.exist(error);
            });

            it('should return a valid token for new login',function() {
                token.length.should.be.greaterThan(0);
            });
        });

        it('one admin should be able to change the role of another admin.', function(done) {

            grasshopper.request(adminToken).users.getById(admin2UserId).then(
                function(payload){
                    payload.role = 'reader';

                    grasshopper.request(adminToken).users.update(payload)
                        .then(
                            function(payload){
                                payload.role.should.equal('reader');
                            },
                            function(err){
                                should.not.exist(err);
                            }
                    ).done(done);
                }
            ).done();

        });

        it('should return error is user is updated without a set "ID"', function(done){
            var newUser = {
                identities: {
                    basic: {
                        login: 'newtestuser1_updated',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };

            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(404);
                    err.message.should.equal('Resource could not be found.');
                }
            ).done(done);
        });

        it('should return error if login is too short.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        login: 'sho',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Your login is too short.');
                }
            ).done(done);
        });

        it('should return error if user role is invalid.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        login: 'newtestuesr1',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader_bad',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.message.should.equal('User\'s role is invalid.');
                    err.code.should.equal(400);
                }
            ).done(done);
        });

        it('should return error if user login is null.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities:{
                    basic:{
                        login: null,
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('login is required.');
                }
            ).done(done);
        });

        it('should return error if user login is empty.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities:{
                    basic: {
                        login: '',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('login is required.');
                }
            ).done(done);
        });

        it('should return error if the user login changed and is now a duplicate.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        login: 'apitestuserreader',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('This login is already in use.');
                }
            ).done(done);
        });

        it('should a user to update themselves even if they do not have global permissions.', function(done){
            var newUser = {
                _id: testReaderUserId,
                identities: {
                    basic: {
                        login: 'apitestuserreader',
                        password: 'TestPassword'
                    }
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                name: 'Updated test reader name with :id'
            };
            grasshopper.request(readerToken).users.update(newUser).then(
                function(payload){
                    payload.identities.basic.login.should.equal(newUser.identities.basic.login);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should error if updating a user with an different ID than your own.', function(done){
            var newUser = {
                _id: testUserId,
                identities: {
                    login: 'apitestuserreader',
                    password: 'TestPassword'
                },
                linkedIdentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Updated test reader name with :id',
                lastname: 'Last'
            };
            grasshopper.request(readerToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                    err.message.should.equal('User does not have enough privileges.');
                }
            ).done(done);
        });

    });

    describe('Query Users', function() {
        var query = {
                filters: [{key: 'role', cmp: '=', value: 'editor'}],
                options: {
                    //include: ['node','fields.testfield']
                }
            },
            query2 = {
                filters: [{key: 'role', cmp: '=', value: 'thisisnotarealrole'}],
                options: {
                    //include: ['node','fields.testfield']
                }
            };

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.query(query).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return a 403 because a user does not have user access.', function(done){
            grasshopper.request(readerToken).users.query(query).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return user search results', function(done) {
            grasshopper.request(adminToken).users.query(query).then(
                function(payload){
                    payload.total.should.equal(2);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should not return user search results', function(done) {
            grasshopper.request(adminToken).users.query(query2).then(
                function(payload){
                    payload.total.should.equal(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

    });

    describe('Delete Users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            grasshopper.request(readerToken).users.deleteById(testUserId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should delete a user.', function(done) {
            grasshopper.request(adminToken).users.deleteById(testCreatedUserId).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 200 when we try to delete a user that doesn\'t exist', function(done) {
            grasshopper.request(adminToken).users.deleteById(testCreatedUserId).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
    });

    describe('Test creating a user, logging in with the new user then revoking the token and confirming that they are locked out', function() {
        it('auth token of user should be revoked if user is disabled.', function(done) {
            var newUser = {
                    role: 'admin',
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    identities: {
                        basic: {
                            login: 'futurerevokee',
                            password: 'TestPassword'
                        }
                    },
                    firstname: 'Test',
                    lastname: 'User'
                },
                mytoken = '';

            function startTest(payload){
                newUser._id = payload._id;
                grasshopper.auth('username', { username: 'futurerevokee', password: 'TestPassword' }).then(authTempUser).done();
            }

            function authTempUser(payload){
                mytoken = payload;
                grasshopper.request(mytoken).users.current().then(disableUser).done();
            }

            // Getting here is proof that the user is logged in.
            function disableUser(){
                newUser.enabled = false;
                grasshopper.request(adminToken).users.update(newUser).then(loadInactiveUser).done();
            }

            function loadInactiveUser(payload){
                grasshopper.request(mytoken).users.current().then(
                    function(payload){
                        should.not.exist(payload);
                    },function(err){
                        err.code.should.equal(401);
                    }).done(done);
            }

            //Create User
            grasshopper.request(adminToken).users.insert(newUser).then(startTest).done();
        });
    });

    describe('Edit a users permissions', function() {
        it('add permission to edit a node with an empty permissions collection.', function(done) {
            grasshopper.request(adminToken).users.savePermissions(testReaderUserId,testNodeForPermissions,'editor').then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);

                }
            ).done(done);
        });

        it('update a permission that a user already has set to another value.', function(done) {
            grasshopper.request(adminToken).users.savePermissions(testReaderUserId,testNodeForPermissions,'none').then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);

                }
            ).done(done);
        });

        it('add a permission that already has a permissions collection.', function(done) {
            grasshopper.request(adminToken).users.savePermissions(testReaderUserId,testSubNodeForPermissions,'editor')
                .then(
                    function(payload){
                        payload.should.equal('Success');
                    },
                    function(err){
                        should.not.exist(err);

                    }
                ).done(done);
        });

        it('try to add permissions unathenticated should result in a 401.', function(done) {
            grasshopper.request().users.savePermissions(testReaderUserId,testSubNodeForPermissions,'editor')
                .then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);

                }
            ).done(done);
        });

        it('try to add permissions without the correct permissions. Should result in a 403.', function(done) {
            grasshopper.request(readerToken).users.savePermissions(testReaderUserId,testSubNodeForPermissions,'editor')
                .then(
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
