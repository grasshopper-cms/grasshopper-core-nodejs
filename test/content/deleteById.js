var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
        path = require('path'),
        _ = require('lodash'),
        grasshopper = require('../../lib/grasshopper').init(require('../fixtures/config')),
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

    before(function(done){
        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
        });
        async.parallel(parallelTokenRequests, done);

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
            var storedData;
            grasshopper.request(tokens.globalEditorToken).content.getById(restrictedContentId).then(
                function(payload){
                    storedData = payload;

                    grasshopper.request(tokens.globalEditorToken).content.deleteById(restrictedContentId).then(
                        function(payload){
                            payload.should.equal('Success');

                            grasshopper
                                .request(tokens.globalEditorToken).content.insert(storedData)
                                .done(done.bind(done, undefined));
                        },
                        function(err){
                            should.not.exist(err);
                        }
                    ).done();
                }).done();
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
});
