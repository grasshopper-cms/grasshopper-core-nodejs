'use strict';
var should = require('chai').should();
var async = require('async'),
    path = require('path'),
    _ = require('lodash'),
    grasshopper,
    start = require('../_start');

describe('Grasshopper core - content', function(){
    var
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
            async.parallel(parallelTokenRequests, done);
        });

    });

    after(function(){
        this.timeout(10000);
    });

    describe('validation', function() {
        describe('Alpha field validation testing for alpha value between 5-10 chars.',function(){
            it('Should pass', function(done) {
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
                    .then(function(payload){
                        payload.fields.label.should.equal('Generated title');
                        return payload._id;
                    })
                    .then(deleteAfterInsertion)
                    .then(done)
                    .fail(done)
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because alpha is too short.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'test'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Title" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because alpha includes a number.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest1'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Title" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });
        });

        describe('Number field validation testing for number value between 0-10',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 8
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(function(payload){
                        payload.fields.label.should.equal('Generated title');
                        return payload._id;
                    })
                    .then(deleteAfterInsertion)
                    .then(done)
                    .fail(done)
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because num is too low.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 4
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because is not a number.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 'string'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because num is too high.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 1000
                    }
                };
                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because number is a string.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: '1a'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because number is a string with a number in the string.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: '1'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Num Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });

            describe('without a min and max', function() {
                it('Should throw 200 even without a min or a max.', function(done) {
                    var obj = {
                        meta: {
                            type: '524362aa56c02c0703000001',
                            node : '526d5179966a883540000006',
                            labelfield: 'testfield'
                        },
                        fields: {
                            label: 'Generated title',
                            testfield: 'testtest',
                            numfield: "6",
                            coopersfield :"2"
                        }
                    };

                    grasshopper
                        .request(tokens.globalEditorToken)
                        .content.insert(obj)
                        .then(function(payload){
                            payload.should.have.property('_id');
                            payload.fields.coopersfield.should.equal('2');
                            return payload._id;
                        })
                        .then(deleteAfterInsertion)
                        .then(done)
                        .fail(done)
                        .catch(done)
                        .done();
                });
            });
        });

        describe('AlphaNumeric field validation testing for length value between 5-10',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        alphanumfield: 'tes123est'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(function(payload){
                        payload.fields.label.should.equal('Generated title');
                        return payload._id;
                    })
                    .then(deleteAfterInsertion)
                    .then(done)
                    .fail(done)
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because alphanum is too short.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        alphanumfield: '123F'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });

            it('Should throw 400 because alphanum is too long.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        alphanumfield: 'tes123fdsfafsdafdsafsdafasfdsaest'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done)
                    .done();
            });
        });

        describe('Unique field validation testing',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        uniquefield1: 'test'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(function(payload){
                        payload.fields.uniquefield1.should.equal('test');
                        return payload._id;
                    })
                    .then(deleteAfterInsertion)
                    .then(done)
                    .fail(done)
                    .catch(done)
                    .done();
            });

            it('Should fail because we just created a record that will conflict.', function(done) {
                var first = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        uniquefield1: 'test'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(first)
                    .then(function(payload){
                        var firstId = payload._id,
                            second = {
                                meta: {
                                    type: '524362aa56c02c0703000001',
                                    node : '526d5179966a883540000006',
                                    labelfield: 'testfield'
                                },
                                fields: {
                                    label: 'Generated title',
                                    testfield: 'testtest',
                                    uniquefield1: 'test'
                                }
                            };

                        grasshopper
                            .request(tokens.globalEditorToken)
                            .content.insert(second)
                            .then(done)
                            .fail(function(err){
                                err.code.should.equal(400);
                                deleteAfterInsertion(firstId)
                                    .then(done);
                            })
                            .catch(done)
                            .done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('Required field validation testing',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '543c10e9926c2be6649cbddb',
                        node : '53fd0c829cc459747101b022',
                        labelfield: 'Title'
                    },
                    fields: {
                        title: 'test'
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(function(payload){
                        payload.fields.title.should.equal('test');
                        return payload._id;
                    })
                    .then(deleteAfterInsertion)
                    .then(done)
                    .catch(done);
            });

            it('Should throw 400 because required field is empty.', function(done) {
                var obj = {
                    meta: {
                        type: '543c10e9926c2be6649cbddb',
                        node : '53fd0c829cc459747101b022',
                        labelfield: 'Title'
                    },
                    fields: {
                        title: ''
                    }
                };

                grasshopper
                    .request(tokens.globalEditorToken)
                    .content.insert(obj)
                    .then(done)
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal('"Title" is not valid. Please check your validation rules and try again.');
                        done();
                    })
                    .catch(done);
            });
        });
    });

    function deleteAfterInsertion(contentId) {
        return grasshopper
            .request(tokens.globalAdminToken)
            .content.deleteById(contentId)
            .then(function() {})
            .fail(function() {});
    }

    function createGetToken(username, password, storage) {
        return {
            closure : function getToken(cb){
                grasshopper
                    .auth('basic', { username: username, password: password })
                    .then(function(token){
                        tokens[storage] = token;
                        cb();
                    })
                    .done();
            }
        };
    }
});
