var should = require('chai').should(),
    async = require('async'),
    path = require('path');

describe('Grasshopper core - testing assets', function(){
    'use strict';

    var async = require('async'),
        fs = require('fs'),
        path = require('path'),
        grasshopper = require('../lib/grasshopper'),
        testNodeId = '5261781556c02c072a000007',
        globalAdminToken  = '',
        globalReaderToken = '',
        globalEditorToken = '',
        nodeEditorToken = '',
        restrictedEditorToken = '';

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
                            },
                            'assets': {
                                'default' : 'local',
                                'tmpdir' : path.join(__dirname, '../tmp'),
                                'engines': {
                                    'local' : {
                                        'path' : path.join(__dirname, '../public'),
                                        'urlbase' : 'http://localhost'
                                    }
                                }
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

    describe('create a new asset in a node', function() {
        it('post test fixtures', function(done) {
            function upload(file, next){
                fs.writeFileSync(path.join(__dirname, file.replace('./fixtures/', '../tmp/')), fs.readFileSync(path.join(__dirname, file)));
                next();
             }

             async.each([
                     './fixtures/artwork.png',
                     './fixtures/36.png',
                     './fixtures/48.png',
                     './fixtures/72.png',
                     './fixtures/96.png'
                 ], upload, done);

        });

        it('an editor with all valid permissions should be able to post an attachment to a node.', function(done) {
            grasshopper.request(globalEditorToken).assets.save({
                    nodeid: testNodeId,
                    filename: 'artwork.png',
                    path: path.join(__dirname, '../tmp/artwork.png')
                }).then(
                    function(payload) {
                        payload.message.should.equal('Success');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
        });
    });


    describe('rename asset', function() {
        it('should rename an asset to a new name in the same node.', function(done) {
            grasshopper.request(globalEditorToken).assets.rename({
                nodeid: testNodeId,
                original: 'artwork.png',
                updated: 'testimage.png'
            }).then(
                function(payload) {
                    payload.message.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should fail because asset does not exist.', function(done) {
            grasshopper.request(globalEditorToken).assets.rename({
                nodeid: testNodeId,
                original: 'artwork_doesntexist.png',
                updated: 'testimage.png'
            }).then(
                function(payload) {
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(404);
                }
            ).done(done);
        });

        it('should fail because the user does not have permissions.', function(done) {
            grasshopper.request(globalReaderToken).assets.rename({
                nodeid: testNodeId,
                original: 'artwork.png',
                updated: 'testimage.png'
            }).then(
                function(payload) {
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });
    });

    describe('copy asset', function() {
        it('should copy an asset from one node to another.', function(done) {
            grasshopper.request(globalEditorToken).assets.copy({
                nodeid: testNodeId,
                newnodeid: '5246e73d56c02c0744000001',
                filename: 'testimage.png'
            }).then(
                function(payload) {
                    payload.message.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

    });

    describe('Get the details of one file', function() {
        it('should get a file from a node specified by the filename.', function(done) {
            grasshopper.request(globalEditorToken).assets.find({
                nodeid: testNodeId,
                filename: 'testimage.png'
            }).then(
                function(payload) {
                    payload.should.be.an.object;
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return a 404 when it could not find the file.', function(done) {
            grasshopper.request(globalEditorToken).assets.find({
                nodeid: testNodeId,
                filename: 'gobledigook.png'
            }).then(
                function(payload) {
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(404);
                }
            ).done(done);
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
    describe('delete named asset', function() {
        before(function(done) {
            function upload(file, next){
                fs.writeFileSync(path.join(__dirname, file.replace('./fixtures/', '../public/' + testNodeId + '/')), fs.readFileSync(path.join(__dirname, file)));
                next();
            }

            async.each([
                './fixtures/assetfordeletion.png',
                './fixtures/36.png',
                './fixtures/48.png',
                './fixtures/72.png',
                './fixtures/96.png'
            ], upload, done);

        });

        it('should delete asset with a specific name', function(done) {
            grasshopper.request(globalEditorToken).assets.delete({
                nodeid: testNodeId,
                filename: 'assetfordeletion.png'
            }).then(
                function(payload) {
                    payload.message.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should fail because the user does not have permissions.', function(done) {
            grasshopper.request(globalReaderToken).assets.delete({
                nodeid: testNodeId,
                filename: 'assetfordeletion.png'
            }).then(
                function(payload) {
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        /** Requires node level permissions
         it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            true.should.equal(false);
            done();
        });
         */
    });

    describe('get all the assets in a node.', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().assets.list({
                nodeid: testNodeId
            }).then(
                function(payload) {
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        /* Requires Node Level Permissions
         it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
         true.should.equal(false);
         done();
         });

         it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
         true.should.equal(false);
         done();
         });
         */

        it('an editor should return a list of files in a node', function(done) {
            grasshopper.request(globalEditorToken).assets.list({
                nodeid: testNodeId
            }).then(
                function(payload) {
                    payload.length.should.equal(5);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });


        /** Deferred until later
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
        });*/
    });

    describe('delete assets', function() {
        it('should delete all files in a node.', function(done) {
            grasshopper.request(globalEditorToken).assets.deleteAll({
                nodeid: testNodeId
            }).then(
                function(payload) {
                    payload.message.should.equal('Success');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should fail because the user does not have permissions.', function(done) {
           grasshopper.request(globalReaderToken).assets.deleteAll({
                nodeid: testNodeId
            }).then(
                function(payload) {
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        /** Requires node level permissions
         it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            true.should.equal(false);
            done();
        });
         */
    });
});