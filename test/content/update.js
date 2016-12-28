'use strict';
var should = require('chai').should();

describe('Grasshopper core - content', function(){

    var async = require('async'),
        path = require('path'),
        _ = require('lodash'),
        grasshopper,
        testContentId  = '5261781556c02c072a000007',
        tokens = {},
        restrictedContentId = '5254908d56c02c076e000001',
        sampleContentObject = null,
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
        this.timeout(10000);

        require('../_start')()
            .then(function(gh) {
                grasshopper = gh;
                _.each(tokenRequests, function(theRequest) {
                    parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
                });
                async.parallel(parallelTokenRequests, createSampleContent.bind(null, done));
            })

    });

    function createSampleContent(done) {
        grasshopper
            .request(tokens.globalReaderToken)
            .content.getById(testContentId).then(function(payload){
                sampleContentObject = payload;
            }).done(done);
    }

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

        it('should return 403 because I am trying to update content in a node that is restricted to me.',
            function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj._id = restrictedContentId;
            obj.fields.newColumn = 'newValue';

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

    it('should successfully update when passed an object containing a null value', function(done) {
        var obj = {};
        _.extend(obj, sampleContentObject, {dateRead: null});

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

    it('should successfully update when passed an object containing an empty string value', function(done) {
        var obj = {};
        _.extend(obj, sampleContentObject, {dateRead: ''});

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

    it('should successfully update when passed an object containing a boolean value', function(done) {
        var obj = {};
        _.extend(obj, sampleContentObject, {dateRead: true});

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

    it('should successfully update when passed an object containing another object', function(done) {
        var obj = {};
        _.extend(obj, sampleContentObject, {dateRead: {"1": "2"}});

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

    it('should successfully update when passed an object containing a number value', function(done) {
        var obj = {};
        _.extend(obj, sampleContentObject, {dateRead: 5});

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

    function createGetToken(username, password, storage) {
        return {
            closure : function getToken(cb){
                grasshopper.auth('basic', {username: username, password: password }).then(function(token){
                    tokens[storage] = token;
                    cb();
                }).done();
            }
        };
    }
});
