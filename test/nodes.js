var should = require('chai').should(),
    async = require('async'),
    path = require('path');

describe('Grasshopper core - testing nodes', function(){
    'use strict';

    var async = require('async'),
        grasshopper = require('../lib/grasshopper'),
        globalAdminToken  = '',
        globalReaderToken = '',
        globalEditorToken = '',
        nodeEditorToken = '',
        restrictedEditorToken = '',
        testNodeId = '5261781556c02c072a000007',
        testLockedDownNodeId = '526d5179966a883540000006',
        testNodeWithNoSubNodes = '5246e73d56c02c0744000001',
        testNodeIdRoot_generated = '',
        testNodeIdSubNode_generated = '',
        testNodeIdSubSub_generated = '',
        testContentTypeID = '524362aa56c02c0703000001',
        testContentTypeID_Users = '5254908d56c02c076e000001',
        badTestContentTypeID = '52698a0033e248a360000006',
        badTestNodeId = '526d545623c0ff9442000006';

    before(function(done){
        async.parallel(
            [
                function(cb){
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
                    cb();
                },
                function(cb){
                    grasshopper.auth('apitestuseradmin', 'TestPassword').then(function(token){
                        globalAdminToken = token;
                        cb();
                    });
                },
                function(cb){
                    grasshopper.auth('apitestuserreader', 'TestPassword').then(function(token){
                            globalReaderToken = token;
                            cb();
                        });
                },
                function(cb){
                    grasshopper.auth('apitestusereditor', 'TestPassword').then(function(token){
                        globalEditorToken = token;
                        cb();
                    });
                },
                function(cb){
                    grasshopper.auth('apitestuserreader_1', 'TestPassword').then(function(token){
                        nodeEditorToken = token;
                        cb();
                    });
                },
                function(cb){
                    grasshopper.auth('apitestusereditor_restricted', 'TestPassword').then(function(token){
                        restrictedEditorToken = token;
                        cb();
                    });
                }
            ],function(){
                done();
            }
        );
    });

    describe('insert', function() {

        it('should create a node beause I have edit permissions.', function(done){
            var n = {
                label : 'My Test Node',
                parent: null
            };

            grasshopper.request(globalEditorToken).nodes.insert(n).then(
                function(payload){
                    testNodeIdRoot_generated = payload._id.toString();
                    payload.label.should.equal('My Test Node');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should create a node (sub node of root)', function(done){
            var n = {
                label : 'My Test Sub-Node',
                parent: testNodeIdRoot_generated
            };

            grasshopper.request(globalEditorToken).nodes.insert(n).then(
                function(payload){
                    var id = payload.parent._id.toString();
                    payload.label.should.equal('My Test Sub-Node');
                    id.should.equal(testNodeIdRoot_generated);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return an error because we are missing a "label" field.', function(done){
            var n = {
                parent: testNodeIdRoot_generated
            };

            grasshopper.request(globalEditorToken).nodes.insert(n).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(400);
                    err.message.should.equal('"label" is a required field.');
                }
            ).done(done);
        });

        it('should create a node when a reader with editor permissions creates a node', function(done){
            var n = {
                label : 'Reader Created Node',
                parent: testNodeId
            };

            grasshopper.request(nodeEditorToken).nodes.insert(n).then(
                function(payload){
                    var id = payload.parent._id.toString();
                    payload.label.should.equal('Reader Created Node');
                    id.should.equal(testNodeId);

                    testNodeIdSubSub_generated = payload._id.toString();
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return error when a reader tries to create a node', function(done){
            var n = {
                label: "Reader Created Node",
                parent: testNodeIdRoot_generated
            };

            grasshopper.request(globalReaderToken).nodes.insert(n).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('should return error when a reader tries to create a node', function(done){
            var n = {
                label: "Editor Created Node",
                parent: testNodeId
            };

            grasshopper.request(restrictedEditorToken).nodes.insert(n).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });
    });

    describe('Add content types to a node.', function() {

        it('should add a content type to an existing node as the property allowedTypes sent as a single string value.', function(done){
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, testContentTypeID).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);

        });

        it('should add a content type to an existing node as the property allowedTypes sent as a single object value.', function(done){
            var t = {
                id: testContentTypeID
            };
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, t).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);

        });

        it('should add a content type to an existing node as the property allowedTypes sent as an array of objects.', function(done){
            var t = [{
                id: testContentTypeID
            },{
                id: testContentTypeID_Users
            }];
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, t).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should add a content type to an existing node as the property allowedTypes sent as an array of strings.', function(done){
            var t = [testContentTypeID, testContentTypeID_Users];
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, t).then(
                function(payload){
                    payload.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should replace a content type in an existing node with existing contenttypes.', function(done){
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, testContentTypeID).then(
                function(){
                    grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, testContentTypeID_Users).then(
                        function(){

                            grasshopper.request(globalEditorToken).nodes.getById(testNodeId).then(
                                function(payload){
                                    payload.allowedTypes[0].label.should.equal('Users');
                                },
                                function(err){
                                    should.not.exist(err);
                                }
                            ).done(done);

                        },function(err){
                            should.not.exist(err);
                        }
                    ).done();
                },function(err){
                    should.not.exist(err);
                }
            ).done();
        });

        it('should fail with 401 if the user is unauthenticated.', function(done){
            grasshopper.request().nodes.saveContentTypes(testNodeId, testContentTypeID).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('Should fail with a 403 if a user does not have editor permissions to the parent node.', function(done){
            grasshopper.request(globalReaderToken).nodes.saveContentTypes(testNodeId, testContentTypeID).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('should fail with 500 if trying to save a content type to a node that doesn\'t exist.', function(done){
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, badTestContentTypeID).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(404);
                }
            ).done(done);
        });
    });

    describe('getById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().nodes.getById(testNodeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(401);
                }
            ).done(done);
        });

        it('should return a node when using a id', function(done) {
            grasshopper.request(globalAdminToken).nodes.getById(testNodeId).then(
                function(payload){
                    payload._id.toString().should.equal(testNodeId);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return a nodes allowedTypes when using a id', function(done) {
            grasshopper.request(globalAdminToken).nodes.getById(testNodeId).then(
                function(payload){
                    payload.should.include.keys('allowedTypes');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return a nodes allowedTypes with the fields (id, label, helptext) when using a id', function(done) {
            grasshopper.request(globalEditorToken).nodes.getById(testNodeId).then(
                function(payload){
                    payload.should.include.keys('allowedTypes');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            grasshopper.request(nodeEditorToken).nodes.getById(testLockedDownNodeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            grasshopper.request(restrictedEditorToken).nodes.getById(testLockedDownNodeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.errorCode.should.equal(403);
                }
            ).done(done);
        });

        it('an editor should return an existing node object', function(done) {
            grasshopper.request(globalEditorToken).nodes.getById(testNodeId).then(
                function(payload){
                    payload._id.toString().should.equal(testNodeId);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('a reader should return an existing node object', function(done) {
            grasshopper.request(globalReaderToken).nodes.getById(testNodeId).then(
                function(payload){
                    payload._id.toString().should.equal(testNodeId);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });
    });

    describe('getById hydrated.', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes and its content', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('getById - Deep load children', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            true.should.equal(false);
            done();
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes including the parent node.', function(done) {
            true.should.equal(false);
            done();
        });
        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('get node children', function() {
        it('should return a 401 because user is not authenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return a 403 because user does not have permissions to access this node', function(done) {
            true.should.equal(false);
            done();
        });

        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return list of root level child nodes', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('create a new asset in a node', function() {
        it('an editor with all valid permissions should be able to post an attachment to a node.', function(done) {
            true.should.equal(false);
            done();
        });

        it('post test fixtures', function(done) {
            function upload(file, next){
                request(url)
                    .post('/node/' + testNodeIdRoot_generated + '/assets')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', 'Token ' + globalEditorToken)
                    .attach('file', file)
                    .end(function(err, res) {
                        if (err) { throw err; }
                        next();
                    });
            }

            async.each([
                './test/fixtures/artwork.png',
                './test/fixtures/36.png',
                './test/fixtures/48.png',
                './test/fixtures/72.png',
                './test/fixtures/96.png'
            ], upload, function(){done});

        });
    });


    describe('rename asset', function() {
        it('should rename an asset to a new name in the same node.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should fail because asset does not exist.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should fail because the user does not have permissions.', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('copy asset', function() {
        it('should copy an asset from one node to another.', function(done) {
            true.should.equal(false);
            done();
        });

    });

    describe('Get the details of one file', function() {
        it('should get a file from a node specified by the filename.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return a 404 when it could not find the file.', function(done) {
            true.should.equal(false);
            done();
        });
    });

/*

     describe('POST: ' + url + '/node/:id/assets/move', function() {
     it('should move one asset to another node.', function(done) {

     request(url)
     .post('/node/' + testNodeId + '/assets/move')
     .set('Accept', 'application/json')
     .set('Accept-Language', 'en_US')
     .set('authorization', 'Token ' + globalEditorToken)
     .send({
     newnodeid: '',
     filename: ''
     })
     .end(function(err, res) {
     if (err) { throw err; }
     res.status.should.equal(200);
     res.body.message.should.equal('Success');
     done();
     });
     });

     it('should fail because the user does not have permissions on the new node id.', function(done) {
     done();
     });

     it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
     done();
     });
     });


     describe('DELETE: ' + url + '/node/:id/assets/:name', function() {
     it('should delete an asset with a specific name', function(done) {

     request(url)
     .del('/node/' + testNodeId + '/assets/' + testNodeId)
     .set('Accept', 'application/json')
     .set('Accept-Language', 'en_US')
     .set('authorization', 'Token ' + globalEditorToken)
     .end(function(err, res) {
     if (err) { throw err; }
     res.status.should.equal(200);
     res.body.message.should.equal('Success');
     done();
     });
     });

     it('should fail because the user does not have permissions.', function(done) {
     done();
     });

     it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
     done();
     });
     });
*/
    describe('delete assets', function() {
        it('should delete all files in a node.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should fail because the user does not have permissions.', function(done) {
            true.should.equal(false);
            done();
        });

        it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('get all the assets in a node.', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            true.should.equal(false);
            done();
        });

        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            true.should.equal(false);
            done();
        });

        it('an editor should return a list of files in a node', function(done) {
            true.should.equal(false);
            done();
        });
        it('a reader should return a list of files in a node', function(done) {
            true.should.equal(false);
            done();
        });

        it('an editor should return a DEEP list of files in a node and it\'s children', function(done) {
            true.should.equal(false);
            done();
        });

        it('an editor should return a DEEP list of files in a node and it\'s children (even when there are no children) And node is empty.', function(done) {
            true.should.equal(false);
            done();
        });

        it('an editor should return a DEEP list of files in a node and it\'s children (even when there are no children) And node is NOT empty.', function(done) {
            true.should.equal(false);
            done();
        });
    });

    describe('deleteById', function() {

        it('Should delete an node.', function(done) {
            true.should.equal(false);
            done();
        });

        it('Should delete a generated node.', function(done) {
            true.should.equal(false);
            done();
        });
    });

});