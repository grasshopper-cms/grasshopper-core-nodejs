/*
var request = require('supertest');

require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
        _ = require('underscore'),
        testContentId  = '5261781556c02c072a000007',
        restrictedContentId = '5254908d56c02c076e000001',
        sampleContentObject = null,
        tokens = {},
        tokenRequests = [
            ['apitestuseradmin:TestPassword', 'globalAdminToken'],
            ['apitestuserreader:TestPassword', 'globalReaderToken'],
            ['apitestusereditor_restricted:TestPassword', 'restrictedEditorToken'],

            // There are no tests for the following:
            ['apitestusereditor:TestPassword', 'globalEditorToken'],
            ['apitestuserreader_1:TestPassword', 'nodeEditorToken']
        ],
        parallelTokenRequests = [];

    before(function(done){
        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1]).closure);
        });
        async.parallel(parallelTokenRequests, done);
    });

    describe('getById', function() {
        it('should return content from a non-protected node unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return 401 because trying to access content from a protected node unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return content because getting content that exists with correct permissions.', function(done) {
            true.should.equal(false);
            done();
        });


        it('should return 403 because getting content from a node that is restricted to me.', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('create', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            true.should.equal(false);
            done();
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            true.should.equal(false);
            done();
        });

        it('should successfully create content because I have the correct permissions.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };


            true.should.equal(false);
            done();
        });


        it('should return 403 because I am trying to create content in a node that is restricted to me.', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live', node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            true.should.equal(false);
            done();
        });
    });

    describe('update', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

            true.should.equal(false);
            done();
        });

        it('should return 403 because I am am only a reader of content.', function(done) {

            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';
            true.should.equal(false);
            done();
        });

        it('should return 200 because I have the correct permissions.', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

            true.should.equal(false);
            done();
        });


        it('should return 403 because I am trying to update content in a node that is restricted to me.', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

            true.should.equal(false);
            done();
        });
    });

    describe('query', function() {
        var query = {
            filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
            options: {
                //include: ['node','fields.testfield']
            }
        }, query2 = {
            filters: [{key: 'nonsense', cmp: '=', value: 'XXXNEVERSHOULDMATCHANTYHINGXXX'}],
            options: {
                //include: ['node','fields.testfield']
            }
        };

        it('should not a 401 because trying to access unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });


        it('should results for public content (unauthenticated)', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return empty results if it finds nothing', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return complete results when a user has correct permissions', function(done){
            true.should.equal(false);
            done();
        });

    });

    describe('deleteById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return 403 because I am trying to delete content from a node that is restricted to me.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should successfully delete content because I have the correct permissions.', function(done) {
            true.should.equal(false);
            done();
        });
    });

    function createGetToken(creds, storage) {
        return {
            closure : function getToken(cb){
                request(url)
                    .get('/token')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', new Buffer(creds).toString('base64'))
                    .end(function(err, res) {
                        if (err) { throw err; }
                        tokens[storage] = res.body.access_token;
                        cb();
                    });
            }
        };
    }
});
 */