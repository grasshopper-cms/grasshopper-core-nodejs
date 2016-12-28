'use strict';
var should = require('chai').should(),
    async = require('async'),
    path = require('path'),
    _ = require('lodash'),
    grasshopper,
    start = require('../_start');


describe('Grasshopper core - content', function(){

        var
        testContentId  = '5261781556c02c072a000007',
        restrictedContentId = '5254908d56c02c076e000001',
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

    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            _.each(tokenRequests, function(theRequest) {
                parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
            });
            async.parallel(parallelTokenRequests, insertContent.bind(null, done));
        });
    });

    after(function(){
        this.timeout(10000);
    });

    describe('getById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper
                .request()
                .content.getById(testContentId)
                .then(function(){
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(401);
                    done(); })
                .done();
        });

        it('should return content from a non-protected node unauthenticated', function(done) {
            grasshopper
                .request(tokens.globalReaderToken)
                .content.getById(testContentId)
                .then(function(payload){
                    payload._id.toString().should.equal(testContentId);
                    done(); })
                .fail(done)
                .done();
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
            grasshopper
                .request(tokens.restrictedEditorToken)
                .content.getById(restrictedContentId)
                .then(function(payload){
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(403);
                    done(); })
                .done();
        });
    });

    function createGetToken(username, password, storage) {
        return {
            closure : function getToken(cb){
                grasshopper.auth('basic', { username: username, password: password }).then(function(token){
                    tokens[storage] = token;
                    cb();
                }).done();
            }
        };
    }

    function insertContent(done) {
        var obj = {
            meta: {
                type: '524362aa56c02c0703000001',
                node : '526d5179966a883540000006',
                labelfield: 'testfield'
            },
            fields: {
                label: 'Generated title',
                testfield: 'testvalue'
            }
        };

        grasshopper
            .request(tokens.globalEditorToken)
            .content.insert(obj)
            .then(function() {
                done(); })
            .fail(done)
            .done();
    }
});
