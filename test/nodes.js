'use strict';
var should = require('chai').should(),
    async = require('async'),
    path = require('path'),
    async = require('async'),
    fs = require('fs'),
    grasshopper,
    start = require('./_start');

describe('Grasshopper core - testing nodes', function(){

    var
        globalAdminToken  = '',
        globalReaderToken = '',
        globalEditorToken = '',
        nodeEditorToken = '',
        restrictedEditorToken = '',
        testNodeId = '5261781556c02c072a000007',
        testNodeSlug = 'node-slug',
        testNodeIdRoot_generated = '',
        testContentTypeID = '524362aa56c02c0703000001',
        testContentTypeID_Users = '5254908d56c02c076e000001',
        badTestContentTypeID = '52698a0033e248a360000006';

    after(function(){
        this.timeout(10000);
    });
    
    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            async.parallel(
                [
                    function(cb){
                        grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' })
                            .then(function(token) {
                                globalAdminToken = token;
                                cb();
                            });
                    },
                    function(cb){
                        grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' })
                            .then(function(token){
                                globalReaderToken = token;
                                cb();
                            });
                    },
                    function(cb){
                        grasshopper.auth('username', { username: 'apitestusereditor', password: 'TestPassword' })
                            .then(function(token){
                                globalEditorToken = token;
                                cb();
                            });
                    },
                    function(cb){
                        grasshopper.auth('username', { username: 'apitestuserreader_1', password: 'TestPassword' })
                            .then(function(token){
                                nodeEditorToken = token;
                                cb();
                            });
                    },
                    function(cb){
                        grasshopper.auth('username', { username: 'apitestusereditor_restricted', password: 'TestPassword' })
                            .then(function(token){
                                restrictedEditorToken = token;
                                cb();
                            });
                    }
                ],function(){
                    done();
                }
            );
        });
    });

    describe('insert', function() {

        it('should create a node beause I have edit permissions.', function(done){
            var n = {
                label : 'My Test Node',
                parent: null
            };

            grasshopper.request(globalEditorToken).nodes.insert(n)
                .then(function(payload){
                    testNodeIdRoot_generated = payload._id.toString();
                    payload.label.should.equal('My Test Node');
                    done(); })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should create a node (sub node of root)', function(done){
            var n = {
                label : 'My Test Sub-Node',
                parent: testNodeIdRoot_generated
            };

            grasshopper.request(globalEditorToken).nodes.insert(n)
                .then(function(payload){
                    var id = payload.parent._id.toString();

                    payload.label.should.equal('My Test Sub-Node');
                    id.should.equal(testNodeIdRoot_generated);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return an error because we are missing a "label" field.', function(done){
            var n = {
                parent: testNodeIdRoot_generated
            };

            grasshopper.request(globalEditorToken).nodes.insert(n)
                .then(doneError.bind(null, done))
                .fail(function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('Path \`label\` is required.');
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });

        /* Requires Node Level Permissions
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
        });*/

        it('should return error when a reader tries to create a node', function(done){
            var n = {
                label: "Reader Created Node",
                parent: testNodeIdRoot_generated
            };

            grasshopper.request(globalReaderToken).nodes.insert(n)
                .then(doneError.bind(null, done))
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return error when a reader tries to create a node', function(done){
            var n = {
                label: "Editor Created Node",
                parent: testNodeId
            };

            grasshopper.request(restrictedEditorToken).nodes.insert(n)
                .then(doneError.bind(null, done))
                .fail(function(err){
                    err.code.should.equal(403);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });
    });

    describe('Add content types to a node.', function() {

        it('should add a content type to an existing node as the property allowedTypes sent as a single string value.', function(done){
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, testContentTypeID)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();

        });

        it('should add a content type to an existing node as the property allowedTypes sent as a single object value.', function(done){
            var t = {
                id: testContentTypeID
            };

            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, t)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();

        });

        it('should add a content type to an existing node as the property allowedTypes sent as an array of objects.', function(done){
            var t = [
                {
                    id: testContentTypeID
                },
                {
                    id: testContentTypeID_Users
                }
            ];

            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, t)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should add a content type to an existing node as the property allowedTypes sent as an array of strings.', function(done){
            var t = [testContentTypeID, testContentTypeID_Users];
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, t)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should replace a content type in an existing node with existing contenttypes.', function(done){
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, testContentTypeID)
                .then(function() {
                    grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, testContentTypeID_Users)
                        .then(function(){
                            grasshopper.request(globalEditorToken).nodes.getById(testNodeId)
                                .then(function(payload){
                                    payload.allowedTypes[0].label.should.equal('Users');
                                    done();
                                })
                                .fail(doneError.bind(null, done))
                                .catch(doneError.bind(null, done))
                                .done();

                        })
                        .fail(doneError.bind(null, done))
                        .catch(doneError.bind(null, done))
                        .done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should fail with 401 if the user is unauthenticated.', function(done){
            grasshopper.request().nodes.saveContentTypes(testNodeId, testContentTypeID)
                .then(doneError.bind(null, done))
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });

        /* Requires Node Level Permissions
        it('Should fail with a 403 if a user does not have editor permissions to the parent node.', function(done){
            grasshopper.request(globalReaderToken).nodes.saveContentTypes(testNodeId, testContentTypeID).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });*/

        it('should fail with 500 if trying to save a content type to a node that doesn\'t exist.', function(done){
            grasshopper.request(globalEditorToken).nodes.saveContentTypes(testNodeId, badTestContentTypeID)
                .then(doneError.bind(null, done))
                .fail(function(err){
                    err.code.should.equal(404);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });
    });

    describe('getById', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().nodes.getById(testNodeId)
                .then(doneError.bind(null, done))
                .fail(function(err) {
                    err.code.should.equal(401);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return a node when using a id', function(done) {
            grasshopper.request(globalAdminToken).nodes.getById(testNodeId)
                .then(function(payload){
                    payload._id.toString().should.equal(testNodeId);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return a nodes allowedTypes when using a id', function(done) {
            grasshopper.request(globalAdminToken).nodes.getById(testNodeId)
                .then(function(payload){
                    payload.should.include.keys('allowedTypes');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return a nodes allowedTypes with the fields (id, label, helptext) when using a id', function(done) {
            grasshopper.request(globalEditorToken).nodes.getById(testNodeId)
                .then(function(payload){
                    payload.should.include.keys('allowedTypes');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        /* Requires Node Level Permissions
        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            grasshopper.request(nodeEditorToken).nodes.getById(testLockedDownNodeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            grasshopper.request(restrictedEditorToken).nodes.getById(testLockedDownNodeId).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });*/

        it('an editor should return an existing node object', function(done) {
            grasshopper.request(globalEditorToken).nodes.getById(testNodeId)
                .then(function(payload){
                    payload._id.toString().should.equal(testNodeId);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('a reader should return an existing node object', function(done) {
            grasshopper.request(globalReaderToken).nodes.getById(testNodeId)
                .then(function(payload){
                    payload._id.toString().should.equal(testNodeId);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });
    });

    describe('getBySlug', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().nodes.getBySlug(testNodeSlug)
                .then(doneError.bind(null, done))
                .fail(function(err) {
                    err.code.should.equal(401);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return a node when using a id', function(done) {
            grasshopper.request(globalAdminToken).nodes.getBySlug(testNodeSlug)
                .then(function(payload){
                    payload._id.toString().should.equal(testNodeId);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return a nodes allowedTypes when using a id', function(done) {
            grasshopper.request(globalAdminToken).nodes.getBySlug(testNodeSlug)
                .then(function(payload){
                    payload.should.include.keys('allowedTypes');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return a nodes allowedTypes with the fields (id, label, helptext) when using a id', function(done) {
            grasshopper.request(globalEditorToken).nodes.getBySlug(testNodeSlug)
                .then(function(payload){
                    payload.should.include.keys('allowedTypes');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('an editor should return an existing node object', function(done) {
            grasshopper.request(globalEditorToken).nodes.getBySlug(testNodeSlug)
                .then(function(payload){
                    payload._id.toString().should.equal(testNodeId);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('a reader should return an existing node object', function(done) {
            grasshopper.request(globalReaderToken).nodes.getBySlug(testNodeSlug)
                .then(function(payload){
                    payload._id.toString().should.equal(testNodeId);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });
    });

    /* Future requirement
    describe('getById hydrated.', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes and its content', function(done) {
            grasshopper.request(globalReaderToken).nodes.getById()
            request(url)
                .get('/node/' + testNodeId + "/hydrate")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(11);
                    done();
                });
            true.should.equal(false);
            done();
        });
    });

    describe('getById - Deep load children', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            grasshopper.request(globalReaderToken).nodes.getChildren(testSubSubWithLockedParent, true, true).then(
                function(payload){
                    //console.log(payload);
                },
                function(err){
                    console.log(err);
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes including the parent node.', function(done) {
            grasshopper.request(globalReaderToken).nodes.getById(testSubSubWithLockedParent, true, true).then(
                function(payload){
                    //console.log(payload);
                },
                function(err){
                    console.log(err);
                    should.not.exist(err);
                }
            ).done(done);
        });
     */

        /* Requires Node Level Permissions
        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            true.should.equal(false);
            done();
        });

    });*/

    describe('get node children', function() {
        it('should return a 401 because user is not authenticated', function(done) {
            grasshopper.request().nodes.getChildren(testNodeId)
                .then(doneError.bind(null, done))
                .fail(function(err){
                    err.code.should.equal(401);
                    done();
                })
                .catch(doneError.bind(null, done))
                .done();
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            grasshopper.request(globalReaderToken).nodes.getChildren(testNodeId)
                .then(function(payload){
                    payload.length.should.equal(9);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        /* Requires Node Level Permissions
        it('should return a 403 because user does not have permissions to access this node', function(done) {
            true.should.equal(false);
            done();
        });

        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            true.should.equal(false);
            done();
        });*/

        it('should return list of root level child nodes', function(done) {
            grasshopper.request(globalReaderToken).nodes.getChildren(null)
                .then(function(payload){
                    // 4 nodes in fixtures + 1 generated
                    payload.length.should.equal(4 + 1);
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });
    });

    // causing a lot of errors spewed to the console - think the node id is not
    // TODO: this should be fixed
    xdescribe('deleteById', function() {
        before(function(done) {
            function upload(file, next){
                fs.writeFileSync(path.join(__dirname, file.replace('./fixtures/', 'public/5320ed3fb9c9cb6364e23031/')), fs.readFileSync(path.join(__dirname, file)));
                next();
            }
            try{
                fs.mkdirSync(path.join(__dirname, 'public/5320ed3fb9c9cb6364e23031/'));
            }
            catch (e){}

            async.each([
                './fixtures/assetfordeletion.png',
                './fixtures/36.png',
                './fixtures/48.png',
                './fixtures/72.png',
                './fixtures/96.png'
            ], upload, done);

        });

        it('Should delete an node.', function(done) {
            grasshopper.request(globalEditorToken).nodes.deleteById(testNodeId)
                .then(function(payload){
                    payload.should.equal('Success');
                    done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should delete a node and all of the content in that node', function(done) {
            var newNode = {
                    label : 'New Test Node',
                    parent: null
                },
                newNodeId,
                newContentId;

            grasshopper.request(globalAdminToken).nodes.insert(newNode)
                .then(function(payload){
                    newNodeId = payload._id;

                    var newContent = {
                        meta: {
                            type: '524362aa56c02c0703000001',
                            node : newNodeId,
                            labelfield: 'testfield'
                        },
                        fields: {
                            testfield: 'testvalue'
                        }
                    };

                    grasshopper.request(globalAdminToken).content.insert(newContent)
                        .then(function(newContentPayload) {
                            newContentId = newContentPayload._id;

                            grasshopper.request(globalAdminToken).nodes.deleteById(newNodeId)
                                .then(function(response){
                                    response.should.equal('Success');

                                    grasshopper.request(globalAdminToken).content.getById(newContentId)
                                        .then(doneError.bind(null, done))
                                        .fail(function(error) {
                                            error.code.should.equal(404);
                                            error.message.should.equal('Resource could not be found.');
                                            done();
                                        })
                                        .catch(doneError.bind(null, done))
                                        .done();
                                })
                                .fail(doneError.bind(null, done))
                                .catch(doneError.bind(null, done))
                                .done();
                        })
                        .fail(doneError.bind(null, done))
                        .catch(doneError.bind(null, done))
                        .done();
                })
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        /* Requires Node Level Permissions
        it('Should delete a generated node.', function(done) {
            grasshopper.request(globalEditorToken).nodes.deleteById(testNodeIdSubSub_generated).then(
                function(payload){
                    console.log(payload);
                },
                function(err){
                    console.log(err);
                }
            ).done(done);
        });
        */
    });

    function doneError(done, err) {
        done(err);
    }

    after(function(done){
        function del(file, next){
            try {
                fs.unlinkSync(path.join(__dirname, file));
            } catch(e) {}
            next();
        }

        async.each([
            'tmp/36.png',
            'tmp/48.png',
            'tmp/72.png',
            'tmp/96.png'
        ], del, done);
    });
});
