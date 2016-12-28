'use strict';
var chai = require('chai'),
    config = require('../lib/config'),
    should = require('chai').should(),
    grasshopper,
    path = require('path'),
    async = require('async'),
    start = require('./_start');

describe('Grasshopper core - users', function(){

    var
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
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' })
                .then(function(token){
                    adminToken = token;
                    grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' })
                        .then(function(token){
                            readerToken = token;
                            done();
                        })
                        .fail(done)
                        .catch(done)
                        .done();
                });
        });
    });

    after(function(){
        this.timeout(10000);
    });
    
    describe('Get a user by email', function(){
        it('Make sure that a reader cannot call getByEmail method (only admins can)', function(done) {
            grasshopper.request(readerToken).users.getByEmail('apitestuser_1@thinksolid.com')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('Make sure that admin can get a user by it\'s email address.', function(done) {
            grasshopper.request(adminToken).users.getByEmail('apitestuser_1@thinksolid.com')
                .then(function(payload){
                    payload.email.should.equal('apitestuser_1@thinksolid.com');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getByEmail('test@test.com')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getByEmail('test@test.com')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(404);
                    done();
                })
                .catch(done)
                .done();
        });
    });

    describe('Get a user by slug', function(){
        it('Make sure that a reader cannot call getBySlug method (only admins can)', function(done) {
            grasshopper.request(readerToken).users.getBySlug('user-slug')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('Make sure that admin can get a user by slug.', function(done) {
            grasshopper.request(adminToken).users.getBySlug('user-slug')
                .then(function(payload){
                    payload.slug.should.equal('user-slug');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getBySlug('user-slug')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getBySlug('user-slugblah')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(404);
                    done();
                })
                .catch(done)
                .done();
        });
    });

    describe('Get a user by id', function() {
        it('Make sure that a reader cannot call getById method (only admins can)', function(done) {
            grasshopper.request(readerToken).users.getById('5246e73d56c02c0744000004')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('Make sure that admin can get a by getById', function(done) {
            grasshopper.request(adminToken).users.getById('5246e73d56c02c0744000004')
                .then(function(payload){
                    payload.email.should.equal('apitestuser@thinksolid.com');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.getById('5246e73d56c02c0744000004')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).users.getById('526417710658fc1f0a00000b')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(404);
                    done();
                })
                .catch(done)
                .done();
        });
    });

    describe('Get info about the current logged in user', function() {
        it('should return the current logged in user', function(done) {
            grasshopper.request(readerToken).users.current()
                .then(function(payload){
                    payload.email.should.equal('apitestuser@thinksolid.com');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return a 401 because user is not authenticated', function(done) {
            grasshopper.request().users.current()
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });
    });

    describe('Get user list', function() {
        it('should return a list of users with the default page size', function(done) {
            grasshopper.request(adminToken).users.list()
                .then(function(payload){
                    payload.results.length.should.equal(7);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should a list of users with the specified page size', function(done) {
            grasshopper.request(adminToken).users.list({ limit : 1 })
                .then(function(payload){
                    payload.results.length.should.equal(1);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return a 403 because user does not have permissions to access users', function(done) {
            grasshopper.request(readerToken).users.list()
                .then(done)
                .fail(function(err) {
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return an empty list if the page size and current requested items are out of bounds.', function(done) {
            grasshopper.request(adminToken).users.list({limit : 10, skip : 30})
                .then(function(payload){
                    payload.results.length.should.equal(0);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return a 401 because user is not authenticated', function(done) {
            grasshopper.request().users.list()
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });
    });

    describe('insert a new user', function() {
        it('should error out because user does not have enough permissions to insert a user.', function(done){
            grasshopper.request(readerToken).users.insert({})
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should insert a user without an error.', function(done){
            var newUser = {
                role: 'reader',
                identities: {
                    basic: {
                        username: 'newtestuser1',
                        password: 'TestPassword'
                    }
                },
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    payload.should.have.property('_id');
                    payload.should.have.property('linkedidentities');
                    payload.should.not.have.property('identities');
                    testCreatedUserId = payload._id;
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
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
                        username: 'newtestuser2',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    payload.should.have.property('_id');
                    payload.should.not.have.property('password');
                    payload.should.not.have.property('identities');
                    testCreatedUserIdCustomVerb = payload._id;
                    done();
                })
                .catch(done)
                .fail(done)
                .done();
        });

        describe('profile', function() {
            it('should insert a user with a empty profile even if one was not sent', function(done){
                var newUser = {
                    role: 'external',
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    firstname: 'Test',
                    lastname: 'User',
                    identities: {
                        basic: {
                            username: 'Leonardo',
                            password: 'TestPassword'
                        }
                    }
                };

                grasshopper.request(adminToken).users.insert(newUser)
                    .then(function(payload){
                        payload.should.have.property('profile');
                        done();
                    })
                    .catch(done)
                    .fail(done)
                    .done();
            });
        });

        describe('displayname', function() {
            it('should set the displayname on a user when inserting', function(done) {
                var newUser = {
                    role: 'admin',
                    identities: {
                        basic: {
                            username: 'UncleBob',
                            password: 'TestPassword'
                        }
                    },
                    enabled: true,
                    displayname : 'UncleBob',
                    email: 'newtestuser1@thinksolid.com',
                    firstname: 'Test',
                    lastname: 'User'
                };

                grasshopper.request(adminToken).users.insert(newUser)
                    .then(function(payload){
                        payload.should.have.property('displayname');
                        payload.displayname.should.equal('UncleBob');
                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });

            describe('should set a default displayname if one is not sent', function() {
                it('BASIC, should use the username.', function(done) {
                    var newUser = {
                        role: 'admin',
                        identities: {
                            basic: {
                                username: 'CooperHilscher',
                                password: 'TestPassword'
                            }
                        },
                        enabled: true,
                        email: 'newtestuser1@thinksolid.com',
                        firstname: 'Test',
                        lastname: 'User'
                    };

                    grasshopper.request(adminToken).users.insert(newUser)
                        .then(function(payload){
                            payload.should.have.property('displayname');
                            payload.displayname.should.equal('CooperHilscher');
                            done();
                        })
                        .fail(done)
                        .catch(done)
                        .done();

                });

                it('GOOGLE, should use the email address.', function(done) {
                    var newUser = {
                        role: 'admin',
                        identities: {
                            google: {
                                something: 'NateDog',
                                somethingElse: 'TestPassword'
                            }
                        },
                        enabled: true,
                        email: 'newtestuser1@thinksolid.com',
                        firstname: 'Test',
                        lastname: 'User'
                    };

                    grasshopper.request(adminToken).users.insert(newUser)
                        .then(function(payload){
                            payload.should.have.property('displayname');
                            payload.displayname.should.equal('newtestuser1@thinksolid.com');
                            done();
                        })
                        .fail(done)
                        .catch(done)
                        .done();

                });
            });
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
                        username: 'somePerson',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    payload.should.have.property('linkedidentities');
                    payload.linkedidentities[0].should.equal('basic');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
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
                        username: 'someOtherPerson',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    linkedid: 'tjmchattie'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    payload.should.not.have.property('identities');
                    payload.linkedidentities.should.deep.equal(['basic']);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
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
                        username: 'newtestuser11111',
                        password: 'TestPassword'
                    }
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Duplicate key already exists.');
                    done();
                })
                .catch(done)
                .done();
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
                        username: 'newtestuser1',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('This username is already in use.');
                    done();
                })
                .catch(done)
                .done();
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
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('username is required.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if an empty username is provided.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        username: '',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('username is required.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if an null username is provided.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        username: null,
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('username is required.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if a username is too short.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        username: 'sho',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Your username is too short.');
                    done();
                })
                .catch(done)
                .done();
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
                        username: 'newtestuserunique',
                        password: null
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Password must be at least 6 characters.');
                    done();
                })
                .catch(done)
                .done();
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
                        username: 'newtestuserunique',
                        password: 'sho'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Password must be at least 6 characters.');
                    done();
                })
                .catch(done)
                .done();
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
                        username: 'newtestuserunique',
                        password: 'TestPassword'
                    }
                }
            };
            grasshopper.request(adminToken).users.insert(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('User\'s role is invalid.');
                    done();
                })
                .catch(done)
                .done();
        });
    });

    describe('Update a user', function() {
        it('should return a 401 because user is not authenticated.', function(done){
            grasshopper.request().users.update({})
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        username: 'newtestuser1',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(readerToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    err.message.should.equal('User does not have enough privileges.');
                    done();
                })
                .catch(done)
                .done();
        });

        // This test is buggy, If you console.log the user, Identities object is squashed.
        xit('should update a user', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        username: 'newtestuser1_updated'
                    }
                },
                role: 'reader',
                linkedidentities: ['basic'],
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser)
                .then(function(payload){
                    payload.identities.basic.username.should.equal(newUser.identities.basic.username);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should update a user and drop a previously save profile value.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities: {
                    basic: {
                        username: 'updateAndRemoveProfileValue',
                        password: 'TestPassword'
                    }
                },
                profile: {
                    testval1: 'testval1',
                    testval2: 'testval2'
                }
            };

            grasshopper.request(adminToken).users.insert(newUser)
                .then(function(payload){
                    delete payload.profile.testval1;

                    grasshopper.request(adminToken).users.update(payload)
                        .then(function(payload){
                            should.not.exist(payload.profile.testval1);
                            done();
                        })
                        .fail(done)
                        .catch(done)
                        .done();
                })
                .fail(done)
                .catch(done)
                .done();
        });
        describe('updatedby and createdby', function() {

            it('should add a createdby property on user update if one does not already exist.', function(done){
                var newUser = {
                    role: 'reader',
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    firstname: 'Test',
                    lastname: 'User',
                    identities: {
                        basic: {
                            username: 'updateProfileValue',
                            password: 'TestPassword'
                        }
                    },
                    profile: {
                        testval1: 'testval2',
                        testval2: 'testval1'
                    }
                };

                grasshopper.request(adminToken).users.insert(newUser)
                    .then(function(payload){
                        payload.should.have.property('createdby');
                        delete payload.profile.testval1;

                        grasshopper.request(adminToken).users.update(payload)
                            .then(function(payload){
                                should.exist(payload.createdby);
                                done();
                            })
                            .fail(done)
                            .catch(done)
                            .done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });

            it('should add an updatedby property on user update.', function(done) {
                var newUser = {
                    role: 'reader',
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    firstname: 'Test',
                    lastname: 'User',
                    identities: {
                        basic: {
                            username: 'updatedbyTest',
                            password: 'TestPassword'
                        }
                    },
                    profile: {
                        testval1: 'testval1',
                        testval2: 'testval2'
                    }
                };

                grasshopper.request(adminToken).users.insert(newUser)
                    .then(function(payload){
                        payload.should.have.property('updatedby');
                        delete payload.profile.testval2;

                        grasshopper.request(adminToken).users.update(payload)
                            .then(function(payload){
                                should.exist(payload.updatedby);
                                done();
                            })
                            .fail(done)
                            .catch(done)
                            .done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });

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
                                payload.linkedidentities.should.deep.equal(['basic', 'google']);
                                done();
                            })
                            .fail(done)
                            .catch(done)
                            .done();

                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });

            it('should unlink identities when calling unlink', function(done) {
                grasshopper.request(adminToken).users.unLinkIdentity(testCreatedUserId, 'google')
                    .then(function(payload){
                        payload.should.equal('Success');

                        grasshopper.request(adminToken).users.getById(testCreatedUserId)
                            .then(function(payload) {
                                payload.linkedidentities.should.deep.equal(['basic']);
                                done();
                            })
                            .fail(done)
                            .catch(done)
                            .done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });

        });

        // This block should be rewritten with promises - would be easy to break apart into actual separate tests like that
        describe('admin should be able to change a user\'s password', function(){
            var token,
                error;

            before(function (done) {
                function getTestUser(next){
                    grasshopper.request(adminToken).users.getById(testReaderUserId)
                        .then(function(payload){
                            next(null, payload);
                        })
                        .fail(function(err){
                            next(err);
                        })
                        .done();
                }

                function updateUser(user, next){
                    user.identities = {
                        basic : {
                            password : 'thisismytestpassword'
                        }
                    };

                    grasshopper.request(adminToken).users.update(user)
                        .then(function(){
                            next();
                        })
                        .fail(function(err){
                            next(err);
                        })
                        .done();
                }

                function tryUseOldLogin(next){
                    grasshopper.auth('basic', { username: 'apitestuserreader', password: 'TestPassword' })
                        .then(function(token){
                            next(should.not.exist(token));
                        })
                        .fail(function(){
                            next();
                        });
                }

                function tryUseNewLogin(next){
                    grasshopper.auth('basic', { username: 'apitestuserreader', password: 'thisismytestpassword' })
                        .then(function(token){
                            next(null, token);
                        })
                        .fail(function(err){
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

            it('should return a valid token for new username',function() {
                token.length.should.be.greaterThan(0);
            });

            it('on a user with no initial password', function(done) {
                var newUser = {
                    role: 'reader',
                    identities: {
                        facebook: {
                            "id" : "335847583474555",
                            "accessToken" : "KzOX7aHcO4WT21hfsm",
                            "expires" : "5184000"
                        }
                    },
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    firstname: 'Test',
                    lastname: 'User'
                };
                grasshopper.request(adminToken).users.insert(newUser)
                    .then(function(user) {
                        user.identities = {
                            basic : {
                                username: 'newtestuser1@thinksolid.com',
                                password : 'thisismytestpassword'
                            }
                        };

                        return grasshopper.request(adminToken).users.update(user);
                    })
                    .then(function() {
                        return grasshopper.auth('basic', {
                            username: 'newtestuser1@thinksolid.com',
                            password: 'thisismytestpassword'
                        })
                    })
                    .then(function() {
                        done();
                    })
                    .catch(done);
            });
        });

        it('one admin should be able to change the role of another admin.', function(done) {

            grasshopper.request(adminToken).users.getById(admin2UserId)
                .then(function(payload){
                    payload.role = 'reader';

                    grasshopper.request(adminToken).users.update(payload)
                        .then(function(payload){
                            payload.role.should.equal('reader');
                            done();
                        })
                        .fail(done)
                        .catch(done)
                        .done();
                })
                .done();
        });

        it('should return error is user is updated without a set "ID"', function(done){
            var newUser = {
                identities: {
                    basic: {
                        username: 'newtestuser1_updated',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };

            grasshopper.request(adminToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(404);
                    err.message.should.equal('Resource could not be found.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if username is too short.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        username: 'sho',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Your username is too short.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if user role is invalid.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        username: 'newtestuesr1',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader_bad',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.message.should.equal('User\'s role is invalid.');
                    err.code.should.equal(400);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if user username is null.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities:{
                    basic:{
                        username: null,
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Password, when supplied, cannot be empty.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if user username is empty.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities:{
                    basic: {
                        username: '',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Password, when supplied, cannot be empty.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return error if the user username changed and is now a duplicate.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                identities: {
                    basic: {
                        username: 'apitestuserreader',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User'
            };
            grasshopper.request(adminToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('This username is already in use.');
                    done();
                })
                .catch(done)
                .done();
        });

        it('should allow a user to update themselves even if they do not have global permissions.', function(done){
            var newUser = {
                _id: testReaderUserId,
                identities: {
                    basic: {
                        username: 'apitestuserreader',
                        password: 'TestPassword'
                    }
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                name: 'Updated test reader name with :id'
            };
            grasshopper.request(readerToken).users.update(newUser)
                .then(function(payload){
                    payload._id.toString().should.equal('5246e80c56c02c0744000002');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should error if updating a user with an different ID than your own.', function(done){
            var newUser = {
                _id: testUserId,
                identities: {
                    username: 'apitestuserreader',
                    password: 'TestPassword'
                },
                linkedidentities: [ 'basic' ],
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Updated test reader name with :id',
                lastname: 'Last'
            };
            grasshopper.request(readerToken).users.update(newUser)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    err.message.should.equal('User does not have enough privileges.');
                    done();
                })
                .catch(done)
                .done();
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
            },
            query3 = {
                filters: [],
                options: {
                    skip: 0,
                    limit: 1
                }
            },
            query4 = {
                filters: [],
                options: {}
            };

        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().users.query(query)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return a 403 because a user does not have user access.', function(done){
            grasshopper.request(readerToken).users.query(query)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should return user search results', function(done) {
            grasshopper.request(adminToken).users.query(query)
                .then(function(payload){
                    payload.total.should.equal(2);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should not return user search results', function(done) {
            grasshopper.request(adminToken).users.query(query2)
                .then(function(payload){
                    payload.total.should.equal(0);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        describe('setting the query limit', function() {
            describe('should respect the limit passed in', function() {
                it('should return only one user when the limit is one', function(done) {
                    grasshopper.request(adminToken).users.query(query3)
                        .then(function(payload) {
                            payload.results.length.should.equal(1);
                            done();
                        })
                        .fail(done)
                        .catch(done)
                        .done();
                });
            });

            it('should use a default if none is passed', function(done) {
                grasshopper.request(adminToken).users.query(query4)
                    .then(function(payload) {
                        payload.limit.should.equal(config.db.defaultPageSize);
                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });
    });

    describe('Delete Users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            grasshopper.request(readerToken).users.deleteById(testUserId)
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });

        it('should delete a user.', function(done) {
            grasshopper.request(adminToken).users.deleteById(testCreatedUserId)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('should return 200 when we try to delete a user that doesn\'t exist', function(done) {
            grasshopper.request(adminToken).users.deleteById(testCreatedUserId)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
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
                            username: 'futurerevokee',
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
                grasshopper.request(mytoken).users.current()
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(401);
                        done();
                    })
                    .catch(done)
                    .done();
            }

            //Create User
            grasshopper.request(adminToken).users.insert(newUser).then(startTest).done();
        });
    });

    describe('Edit a users permissions', function() {
        it('add permission to edit a node with an empty permissions collection.', function(done) {
            grasshopper.request(adminToken).users.savePermissions(testReaderUserId,testNodeForPermissions,'editor')
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('update a permission that a user already has set to another value.', function(done) {
            grasshopper.request(adminToken).users.savePermissions(testReaderUserId,testNodeForPermissions,'none')
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('add a permission that already has a permissions collection.', function(done) {
            grasshopper.request(adminToken).users.savePermissions(testReaderUserId,testSubNodeForPermissions,'editor')
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
        });

        it('try to add permissions unathenticated should result in a 401.', function(done) {
            grasshopper.request().users.savePermissions(testReaderUserId,testSubNodeForPermissions,'editor')
                .then(done)
                .fail(function(err) {
                    err.code.should.equal(401);
                    done();
                })
                .catch(done)
                .done();
        });

        it('try to add permissions without the correct permissions. Should result in a 403.', function(done) {
            grasshopper.request(readerToken).users.savePermissions(testReaderUserId,testSubNodeForPermissions,'editor')
                .then(done)
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(done)
                .done();
        });
    });
});
