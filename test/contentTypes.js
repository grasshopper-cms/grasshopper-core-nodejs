var should = require('chai').should();

describe('Grasshopper core - contentTypes', function(){
    'use strict';

    var grasshopper= require('../lib/grasshopper'),
        testContentTypeId  = '524362aa56c02c0703000001',
        readerToken = '',
        adminToken  = '',
        testCreatedContentTypeId = '';

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

    describe('getById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().contentTypes.getById(testContentTypeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('should return an existing content type', function(done) {
            grasshopper.request(adminToken).contentTypes.getById(testContentTypeId).then(
                function(payload){
                    payload._id.toString().should.equal(testContentTypeId);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
        it('should return 404 because test user id does not exist', function(done) {
            grasshopper.request(adminToken).contentTypes.getById('5246e73d56c02c0744000004').then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(404);
                }
            ).done(done);
        });
    });

    describe('get list', function() {
        it('should return a list of content types with the default page size', function(done) {
            grasshopper.request(adminToken).contentTypes.list().then(
                function(payload){
                    payload.results.length.should.equal(2);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
        it('should a list of content types with the specified page size', function(done) {
            grasshopper.request(adminToken).contentTypes.list({limit:1}).then(
                function(payload){
                    payload.results.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return an empty list if the page size and current requested items are out of bounds.', function(done) {
            grasshopper.request(adminToken).contentTypes.list({limit: 20, skip: 100}).then(
                function(payload){
                    payload.results.length.should.equal(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
        it('should return a 401 because user is not authenticated', function(done) {
            grasshopper.request().contentTypes.list().then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });
    });

    describe('create', function() {
        it('should create a content type', function(done){
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: {
                    testfield: {
                        required: true,
                        label: 'Title',
                        instancing: 1,
                        type: 'textbox'
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };
            grasshopper.request(adminToken).contentTypes.create(newContentType).then(
                function(payload){
                    payload.label.should.equal(newContentType.label);
                    testCreatedContentTypeId = payload._id;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return an error because we are missing a "label" field.', function(done){
            var newContentType = {
                fields: {
                    testid: {
                        required: true,
                        label: 'Title',
                        instancing: 1,
                        type: 'textbox'
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };
            grasshopper.request(adminToken).contentTypes.create(newContentType).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"label" is a required field.');
                }
            ).done(done);
        });

        it('should return error when a malformed field id is passed in (id has a space).', function(done){
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: {
                    'test id' :{
                        label: 'This is a test label',
                        required: true,
                        instancing: 1,
                        type: 'textbox'
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.create(newContentType).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });

        it('should return error when a malformed field is passed in (missing label).', function(done){
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: {
                    testid: {
                        required: true,
                        instancing: 1,
                        type: 'textbox'
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.create(newContentType).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });

        it('should return error when a malformed field is passed in (missing type).', function(done){
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: {
                    testid: {
                        label: 'Test Field Label',
                        required: true,
                        instancing: 1
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.create(newContentType).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });

        it('should return error when a malformed field is passed in (invalid type).', function(done){
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: {
                    testid: {
                        label: 'Test Field Label',
                        type: 'I DONT EXIST',
                        required: true,
                        instancing: 1
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.create(newContentType).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });
    });

    describe('update', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: {
                    testfield: {
                        required: true,
                        label: 'Title',
                        instancing: 1,
                        type: 'textbox'
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(readerToken).contentTypes.update(newContentType).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('should update a content type', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: {
                    testid : {
                        id: 'testid',
                        label: 'Test Field Label',
                        type: 'textbox',
                        required: true,
                        instancing: 1
                    }
                },
                helpText: '',
                meta: {testmetaid:{
                    label: 'Test Field Label',
                    type: 'textbox',
                    required: true,
                    instancing: 1
                }},
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType).then(
                function(payload){
                    payload.label.should.equal(newContentType.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return error if content type is updated without a set "ID"', function(done){
            var newContentType = {
                label: 'updatedlabel',
                fields: {
                    testid : {
                        id: 'testid',
                        label: 'Test Field Label',
                        type: 'textbox',
                        required: true,
                        instancing: 1
                    }
                },
                helpText: '',
                meta: {testmetaid:{
                    label: 'Test Field Label',
                    type: 'textbox',
                    required: true,
                    instancing: 1
                }},
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType).then(
                function(payload){
                    payload.should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(404);
                }
            ).done(done);
        });

    });

    describe('deleteById', function() {
        it('should return a 403 because user does not have permissions to access content types', function(done) {
            grasshopper.request(readerToken).contentTypes.deleteById(testContentTypeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('should delete a content type', function(done) {
            grasshopper.request(adminToken).contentTypes.deleteById(testContentTypeId).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 200 when we try to delete a content type that doesn\'t exist', function(done) {
            grasshopper.request(adminToken).contentTypes.deleteById(testContentTypeId).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
    });
});
