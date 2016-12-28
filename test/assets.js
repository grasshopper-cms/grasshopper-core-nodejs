'use strict';

var should = require('chai').should(),
    start = require('./_start'),
    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    grasshopper,
    testNodeId = '5261781556c02c072a000007',
    globalAdminToken  = '',
    globalReaderToken = '',
    globalEditorToken = '',
    nodeEditorToken = '',
    restrictedEditorToken = '';



describe('Grasshopper core - testing assets', function(){
    after(function(){
        this.timeout(10000)
    });
    
    before(function(run) {
        this.timeout(10000);
        start(grasshopper)
            .then(function(gh) {
                grasshopper = gh;
                async.parallel(
                    [
                        function(cb){
                            grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' }).then(function(token){
                                globalAdminToken = token;
                                cb();
                            }).catch(function(e) {
                                console.log('erroer',e);
                            });
                        },
                        function(cb){
                            grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' }).then(function(token){
                                globalReaderToken = token;
                                cb();
                            }).catch(function(e) {
                                console.log('erroer',e);
                            });
                        },
                        function(cb){
                            grasshopper.auth('username', { username: 'apitestusereditor', password: 'TestPassword' }).then(function(token){
                                globalEditorToken = token;
                                cb();
                            }).catch(function(e) {
                                console.log('erroer',e);
                            });
                        },
                        function(cb){
                            grasshopper.auth('username', { username: 'apitestuserreader_1', password: 'TestPassword' }).then(function(token){
                                nodeEditorToken = token;
                                cb();
                            }).catch(function(e) {
                                console.log('erroer',e);
                            });
                        },
                        function(cb){
                            grasshopper.auth('username', { username: 'apitestusereditor_restricted', password: 'TestPassword' }).then(function(token){
                                console.log('ok');
                                restrictedEditorToken = token;
                                cb();
                            }).catch(function(e) {
                                console.log('erroer',e);
                            });
                        }
                    ],function(){
                        run();
                    }
                );
            });

    });

    describe('create a new asset in a node', function() {
        it('post test fixtures', function(done) {
            function upload(file, next){
                fs.writeFileSync(path.join(__dirname, file.replace('./fixtures/', 'tmp/')), fs.readFileSync(path.join(__dirname, file)));
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
                    path: path.join(__dirname, 'tmp/artwork.png')})
                .then(function(payload) {
                    payload.message.should.equal('Success');
                    done(); })
                .catch(done);
        });
    });


    xdescribe('rename asset', function() {
        it('should rename an asset to a new name in the same node.', function(done) {
            grasshopper.request(globalEditorToken).assets.rename({
                nodeid: testNodeId,
                original: 'artwork.png',
                updated: 'testimage.png'
            }).then(
                function(payload) {
                    payload.message.should.equal('Success');
                    done(); })
                .fail(done)
                .done();
        });

        it('should fail because asset does not exist.', function(done) {
            grasshopper
                .request(globalEditorToken).assets.rename({
                    nodeid: testNodeId,
                    original: 'artwork_doesntexist.png',
                    updated: 'testimage.png' })
                .then(function() {
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(404);
                    done(); })
                .done();
        });

        it('should fail because the user does not have permissions.', function(done) {
            grasshopper
                .request(globalReaderToken).assets.rename({
                    nodeid: testNodeId,
                    original: 'artwork.png',
                    updated: 'testimage.png' })
                .then(function() {
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(403);
                    done(); })
                .done();
        });
    });

    xdescribe('copy asset', function() {
        it('should copy an asset from one node to another.', function(done) {
            grasshopper
                .request(globalEditorToken)
                .assets.copy({
                    nodeid: testNodeId,
                    newnodeid: '5246e73d56c02c0744000001',
                    filename: 'testimage.png' })
                .then(function(payload) {
                    payload.message.should.equal('Success');
                    done(); })
                .fail(done)
                .done();
        });

    });

    xdescribe('Get the details of one file', function() {
        it('should get a file from a node specified by the filename.', function(done) {
            grasshopper
                .request(globalEditorToken)
                .assets.find({
                    nodeid: testNodeId,
                    filename: 'testimage.png' })
                .then(function(payload) {
                    payload.should.be.an.object;
                    done(); })
                .fail(done)
                .done();
        });

        it('should return a 404 when it could not find the file.', function(done) {
            grasshopper
                .request(globalEditorToken)
                .assets.find({
                    nodeid: testNodeId,
                    filename: 'gobledigook.png' })
                .then(function() {
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(404);
                    done(); })
                .done();
        });
    });

    xdescribe('Move an asset', function() {
        before(function(done) {
            function upload(file, next){
                fs.writeFileSync(path.join(__dirname, file.replace('./fixtures/', 'public/' + testNodeId + '/')), fs.readFileSync(path.join(__dirname, file)));
                next();
            }

            async.each([
                './fixtures/36.png'
            ], upload, done);

        });

        it('should move a file to a new location', function(done) {
            grasshopper
                .request(globalEditorToken)
                .assets.move({
                    nodeid: testNodeId,
                    filename: '36.png',
                    newnodeid: '5246e73d56c02c0744000001' })
                .then(function(payload) {
                    payload.should.be.an.object;
                    done(); })
                .fail(done)
                .done();
        });

        it('should return a 404 when it could not find the file.', function(done) {
            grasshopper
                .request(globalEditorToken)
                .assets.find({
                    nodeid: testNodeId,
                    filename: 'gobledigook.png',
                    newnodeid: '5246e73d56c02c0744000001' })
                .then(function() {
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(404);
                    done(); })
                .done();
        });
    });

    xdescribe('delete named asset', function() {
        before(function(done) {
            function upload(file, next){
                fs.writeFileSync(path.join(__dirname, file.replace('./fixtures/', 'public/' + testNodeId + '/')), fs.readFileSync(path.join(__dirname, file)));
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
            grasshopper
                .request(globalEditorToken)
                .assets.delete({
                    nodeid: testNodeId,
                    filename: 'assetfordeletion.png' })
                .then(function(payload) {
                    payload.message.should.equal('Success');
                    done(); })
                .fail(done)
                .done();
        });

        it('should fail because the user does not have permissions.', function(done) {
            grasshopper
                .request(globalReaderToken)
                .assets.delete({
                    nodeid: testNodeId,
                    filename: 'assetfordeletion.png' })
                .then(function() {
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(403);
                    done(); })
                .done();
        });

        /** Requires node level permissions
         it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            true.should.equal(false);
            done();
        });
         */
    });

    xdescribe('get all the assets in a node.', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            grasshopper
                .request()
                .assets.list({
                    nodeid: testNodeId })
                .then(function() {
                    done(new Error('Should not succeed')); })
                .fail(function(err){
                    err.code.should.equal(401);
                    done(); })
                .done();
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
            grasshopper
                .request(globalEditorToken)
                .assets.list({
                    nodeid: testNodeId })
                .then(function(payload) {
                    payload.length.should.equal(5);
                    done(); })
                .fail(done)
                .done();
        });

        it('Getting root node should work', function(done) {
            grasshopper.request(globalEditorToken).assets.list({
                nodeid: 0
            })
                .then(
                    function(payload) {
                        payload.should.exist;
                        done();
                    }
                )
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
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

    xdescribe('delete assets', function() {
        it('should delete all files in a node.', function(done) {
            grasshopper
                .request(globalEditorToken)
                .assets.deleteAll({
                    nodeid: testNodeId })
                .then(function(payload) {
                    payload.message.should.equal('Success');
                    done(); })
                .fail(done)
                .done();
        });

        it('should fail because the user does not have permissions.', function(done) {
           grasshopper
               .request(globalReaderToken)
               .assets.deleteAll({
                    nodeid: testNodeId })
               .then(function() {
                    done(new Error('Should not succeed')); })
               .fail(function(err){
                   err.code.should.equal(403);
                   done(); })
               .done();
        });

        /** Requires node level permissions
         it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            true.should.equal(false);
            done();
        });
         */
    });

    function doneError(done, err) {
        done(err);
    }
});
