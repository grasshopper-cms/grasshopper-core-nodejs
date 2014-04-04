var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
        path = require('path'),
        _ = require('underscore'),
        grasshopper = require('../lib/grasshopper'),
        testContentId  = '5261781556c02c072a000007',
        restrictedContentId = '5254908d56c02c076e000001',
        sampleContentObject = null,
        tokens = {},
        tokenRequests = [
            ['apitestuseradmin', 'TestPassword', 'globalAdminToken'],
            ['apitestuserreader', 'TestPassword', 'globalReaderToken'],
            ['apitestusereditor_restricted', 'TestPassword', 'restrictedEditorToken'],

            // There are no tests for the following:
            ['apitestusereditor', 'TestPassword', 'globalEditorToken'],
            ['apitestuserreader_1', 'TestPassword', 'nodeEditorToken']
        ],
        parallelTokenRequests = [];

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

        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
        });
        async.parallel(parallelTokenRequests, done);

    });


    describe('getById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().content.getById(testContentId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }).done(done);
        });

        it('should return content from a non-protected node unauthenticated', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.getById(testContentId).then(
                function(payload){
                    payload._id.toString().should.equal(testContentId);
                    sampleContentObject = payload;
                },
                function(err){
                    err.should.not.exist();
                }).done(done);
        });
        /*
        it('should return 401 because trying to access content from a protected node unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return content because getting content that exists with correct permissions.', function(done) {
            true.should.equal(false);
            done();
        });*/


        it('should return 403 because getting content from a node that is restricted to me.', function(done) {
            grasshopper.request(tokens.restrictedEditorToken).content.getById(restrictedContentId).then(
                function(payload){
                    console.log(payload);
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }).done(done);
        });
    });

    describe('insert', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'testvalue'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            grasshopper.request().content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'testvalue'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            grasshopper.request(tokens.globalReaderToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should successfully insert content because I have the correct permissions.', function(done) {
            var obj = {
                type: '524362aa56c02c0703000001', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {label:'Generated title',  testfield: 'testvalue'}
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.label.should.equal(obj.fields.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 403 because I am trying to insert content in a node that is restricted to me.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'testvalue'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            grasshopper.request(tokens.restrictedEditorToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return 400 because the content type we are using is invalid.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '5320ed3fb9c9cb6364e23031', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'testvalue'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };


            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('The content type referenced is invalid.');
                }
            ).done(done);
        });

        describe('Alpha field validation testing for alpha value between 5-10 chars.',function(){
            it('Should pass', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        label:'Generated title',
                        testfield: 'testtest'
                    }
                }).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because alpha is too short.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        testfield: 'test'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Title" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because alpha includes a number.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        testfield: 'testtest1'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Title" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });

        describe('Number field validation testing for number value between 0-10',function(){
            it('Should pass', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        label:'Generated title',
                        testfield: 'testtest',
                        numfield: 8
                    }
                }).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because num is too low.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        testfield: 'testtest',
                        numfield: -1
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because num is too high.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        testfield: 'testtest',
                        numfield: 1000
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because number is a string.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        testfield: 'testtest',
                        numfield: '1a'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because number is a string with a number in the string.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        testfield: 'testtest',
                        numfield: '1'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });

        describe('AlphaNumeric field validation testing for length value between 5-10',function(){
            it('Should pass', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        label:'Generated title',
                        alphanumfield: 'tes123est'
                    }
                }).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because alphanum is too short.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        alphanumfield: '123f'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because alphanum is too long.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        alphanumfield: 'testtefdsafdsaf32432432st'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });

        describe('Email field validation testing',function(){
            it('Should pass', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        label:'Generated title',
                        emailfield: 'test@test.com'
                    }
                }).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because not a valid email address.', function(done) {
                grasshopper.request(tokens.globalEditorToken).content.insert({
                    label:'Generated title',
                    type: '524362aa56c02c0703000001',
                    node: {
                        _id: '526d5179966a883540000006',
                        displayOrder: 1
                    },
                    fields: {
                        emailfield: '123f'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Email Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });
    });

    describe('update', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

            grasshopper.request().content.update(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return 403 because I am am only a reader of content.', function(done) {

            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

            grasshopper.request(tokens.globalReaderToken).content.update(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return 200 because I have the correct permissions.', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

            grasshopper.request(tokens.globalEditorToken).content.update(obj).then(
                function(payload){
                    payload.fields.newColumn.should.equal('newValue');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 403 because I am trying to update content in a node that is restricted to me.', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj._id = restrictedContentId;
            obj.fields.newColumn = 'newValue';
            obj.slug = '3243243242141324312431242112';

            grasshopper.request(tokens.restrictedEditorToken).content.update(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });
    });

    describe('query', function() {
        var query = {
                filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}]
            },
            query2 = {
                filters: [{key: 'nonsense', cmp: '=', value: 'XXXNEVERSHOULDMATCHANTYHINGXXX'}],
                options: {}
            },
            query3 = {
                filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
                options: {
                    include: ['fields.testfield']
                }
            },
            query4 = {
                filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
                options: {
                    exclude: ['fields.newColumn']
                }
            },
            query5 = {
                filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
                options: {
                    sortBy: 1111
                }
            },
            query6 = {
                filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
                options: []
            };;

        it('should not a 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().content.query(query).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return array of search results.', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query).then(
                function(payload){
                    payload.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('test "including" fields in a query', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query3).then(
                function(payload){
                    payload.length.should.equal(1);
                    payload[0].fields.testfield.should.equal('testvalue');
                    payload[0].fields.should.not.have.property('newColumn');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('test "excluding" fields in a query', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query4).then(
                function(payload){
                    payload.length.should.equal(1);
                    payload[0].fields.should.have.property('testfield');
                    payload[0].fields.should.not.have.property('newColumn');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return empty results if it finds nothing', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query2).then(
                function(payload){
                    payload.length.should.equal(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('return valid results even if sortBy is not valid', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query5).then(
                function(payload){
                    payload.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('return valid results even if options is an empty array', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query6).then(
                function(payload){
                    payload.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
/*
        it('should return complete results when a user has correct permissions', function(done){
            true.should.equal(false);
            done();
        });
     */
    });

    describe('deleteById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().content.deleteById(testContentId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.deleteById(testContentId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return 403 because I am trying to delete content from a node that is restricted to me.', function(done) {
            grasshopper.request(tokens.restrictedEditorToken).content.deleteById(restrictedContentId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should successfully delete content because I have the correct permissions.', function(done) {
            grasshopper.request(tokens.globalEditorToken).content.deleteById(restrictedContentId).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
    });

    function createGetToken(username, password, storage) {
        return {
            closure : function getToken(cb){
                grasshopper.auth(username, password).then(function(token){
                    tokens[storage] = token;
                    cb();
                }).done();
            }
        };
    }
});
