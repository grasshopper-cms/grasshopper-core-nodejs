var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
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
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
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
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
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
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };


            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.label.should.equal(obj.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 403 because I am trying to insert content in a node that is restricted to me.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
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
        }, query2 = {
            filters: [{key: 'nonsense', cmp: '=', value: 'XXXNEVERSHOULDMATCHANTYHINGXXX'}],
            options: {
                //include: ['node','fields.testfield']
            }
        };

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
