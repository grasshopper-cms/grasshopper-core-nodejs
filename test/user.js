var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var should = require('chai').should();

describe('Grasshopper core - users', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper'),
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
                }
            };
        });


        grasshopper.auth('apitestuseradmin', 'TestPassword')
            .then(function(token){
                adminToken = token;
                grasshopper.auth('apitestuserreader', 'TestPassword')
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
                    err.errorCode.should.equal(403);
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
                    err.errorCode.should.equal(401);
                }).done(done);
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getByEmail('test@test.com')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.errorCode.should.equal(404);
                }).done(done);
        });
    });

    describe('Get a user by their login.', function(){
        it('Make sure that a reader cannot call getByEmail method (only admins can)', function(done) {
            grasshopper.request(readerToken)
                .users
                .getByEmail('apitestuser_1@thinksolid.com')
                .then(function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }).done(done);

        });

        it('Get a user by their login.', function(done) {
            grasshopper.request(adminToken)
                .users
                .getByLogin('admin')
                .then(function(payload){
                    payload.login.should.equal('admin');
                },function(err){
                    should.not.exist(err);
                }).done(done);
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getByLogin('admin')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.errorCode.should.equal(401);
                }).done(done);
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getByLogin('test')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.errorCode.should.equal(404);
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
                    err.errorCode.should.equal(403);
                }).done(done);

        });

        it('Make sure that admin can get a by getById', function(done) {
            grasshopper.request(adminToken)
                .users
                .getById('5246e73d56c02c0744000004')
                .then(function(payload){
                    payload.login.should.equal('admin');
                },function(err){
                    should.not.exist(err);
                }).done(done);
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getById('5246e73d56c02c0744000004')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.errorCode.should.equal(401);
                }).done(done);
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getById('526417710658fc1f0a00000b')
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.errorCode.should.equal(404);
                }).done(done);
        });
    });

    describe('Get info about the current logged in user', function() {
        it('should return the current logged in user', function(done) {
            grasshopper.request(readerToken).users.current().then(
                function(payload){
                    payload.login.should.equal('apitestuserreader');
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
                    err.errorCode.should.equal(401);
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
                    err.errorCode.should.equal(403);
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
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });
    });

    describe('Create a new user', function() {
        it('should error out because user does not have enough permissions to create a user.', function(done){
            grasshopper.request(readerToken)
                .users
                .create({})
                .then(function(payload){
                    should.not.exist(payload);
                },function(err){
                    err.errorCode.should.equal(403);
                }).done(done);
        });

        it('should create a user without an error.', function(done){
            var newUser = {
                login: 'newtestuser1',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                password: 'TestPassword',
                firstname: 'Test',
                lastname: 'User'
            };

            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    payload.login.should.equal(newUser.login);
                    payload.should.have.property('_id');
                    payload.should.not.have.property('password');
                    testCreatedUserId = payload._id;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should create a user without an error with additional custom params.', function(done){
            var newUser = {
                login: 'newtestuser2',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword',
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    payload.login.should.equal(newUser.login);
                    payload.should.have.property('_id');
                    payload.should.not.have.property('password');
                    testCreatedUserIdCustomVerb = payload._id;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return error if a an existing user id is sent with the request.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: 'newtestuser11111',
                role: 'reader',
                enabled: true,
                email: 'newtestuser2@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };

            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Duplicate key already exists.');
                }
            ).done(done);
        });

        it('should return error if a duplicate is created.', function(done){
            var newUser = {
                login: 'newtestuser1',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Duplicate key already exists.');
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
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"login" is a required field.');
                }
            ).done(done);
        });

        it('should return error if an empty login is provided.', function(done){
            var newUser = {
                login: '',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"login" is a required field.');
                }
            ).done(done);
        });

        it('should return error if an null login is provided.', function(done){
            var newUser = {
                login: null,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"login" is a required field.');
                }
            ).done(done);
        });

        it('should return error if a login is too short.', function(done){
            var newUser = {
                login: 'sho',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Your login is too short.');
                }
            ).done(done);
        });

        it('should return error if a password is null.', function(done){
            var newUser = {
                login: 'newtestuserunique',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: null
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Password must be at least 6 characters.');
                }
            ).done(done);
        });

        it('should return error if a password is too short.', function(done){
            var newUser = {
                login: 'newtestuserunique',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'sho'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Password must be at least 6 characters.');
                }
            ).done(done);
        });

        it('should return error if a user has a role that is not allowed.', function(done){
            var newUser = {
                login: 'newtestuserunique',
                role: 'fake role',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.create(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
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
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                login: 'newtestuser1',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(readerToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                    err.message.should.equal('User does not have enough privileges.');
                }
            ).done(done);
        });

        it('should update a user', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                login: 'newtestuser1_updated',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    payload.login.should.equal(newUser.login);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
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
                login: 'newtestuser1_updated',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };

            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(404);
                    err.message.should.equal('Resource could not be found.');
                }
            ).done(done);
        });

        it('should return error if login is too short.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: 'sho',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Your login is too short.');
                }
            ).done(done);
        });

        it('should return error if user role is invalid.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: 'newtestuesr1',
                role: 'reader_bad',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.message.should.equal('User\'s role is invalid.');
                    err.errorCode.should.equal(400);
                }
            ).done(done);
        });

        it('should return error if user login is null.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: null,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"login" is a required field.');
                }
            ).done(done);
        });

        it('should return error if user login is empty.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: '',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"login" is a required field.');
                }
            ).done(done);
        });

        it('should return error if the user login changed and is now a duplicate.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: 'apitestuserreader',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword'
            };
            grasshopper.request(adminToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Duplicate key already exists.');
                }
            ).done(done);
        });

        it('should a user to update themselves even if they do not have global permissions.', function(done){
            var newUser = {
                _id: testReaderUserId,
                login: 'apitestuserreader',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                name: 'Updated test reader name with :id',
                password: 'TestPassword'
            };
            grasshopper.request(readerToken).users.update(newUser).then(
                function(payload){
                    payload.login.should.equal(newUser.login);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should error if updating a user with an different ID than your own.', function(done){
            var newUser = {
                _id: testUserId,
                login: 'apitestuserreader',
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Updated test reader name with :id',
                lastname: 'Last',
                password: 'TestPassword'
            };
            grasshopper.request(readerToken).users.update(newUser).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
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
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('should return a 403 because a user does not have user access.', function(done){
            grasshopper.request(readerToken).users.query(query).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('should return user search results', function(done) {
            grasshopper.request(adminToken).users.query(query).then(
                function(payload){
                    payload.length.should.equal(2);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should not return user search results', function(done) {
            grasshopper.request(adminToken).users.query(query2).then(
                function(payload){
                    payload.length.should.equal(0);
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
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('should delete a user.', function(done) {
            grasshopper.request(adminToken).users.deleteById(testCreatedUserId).then(
                function(payload){
                    payload.should.equal(true);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 200 when we try to delete a user that doesn\'t exist', function(done) {
            grasshopper.request(adminToken).users.deleteById(testCreatedUserId).then(
                function(payload){
                    payload.should.equal(true);
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
                    login: 'futurerevokee',
                    role: 'admin',
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    password: 'TestPassword',
                    firstname: 'Test',
                    lastname: 'User'
                },
                mytoken = '';

            function startTest(payload){
                newUser._id = payload._id;
                grasshopper.auth('futurerevokee', 'TestPassword').then(authTempUser).done();
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
                        err.errorCode.should.equal(401);
                    }).done(done);
            }

            //Create User
            grasshopper.request(adminToken).users.create(newUser).then(startTest).done();
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
                    err.errorCode.should.equal(401);

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
                    err.errorCode.should.equal(403);

                }
            ).done(done);
        });
    });
});
