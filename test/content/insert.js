var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
        path = require('path'),
        _ = require('underscore'),
        grasshopper = require('../../lib/grasshopper'),
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
                },
                'assets': {
                    'default' : 'local',
                    'tmpdir' : path.join(__dirname, 'tmp'),
                    'engines': {
                        'local' : {
                            'path' : path.join(__dirname, 'public'),
                            'urlbase' : 'http://localhost'
                        }
                    }
                }
            };
        });

        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
        });
        async.parallel(parallelTokenRequests, done);

    });

    describe('insert', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    testfield: 'testvalue'
                }
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
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    testfield: 'testvalue'
                }
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

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.label.should.equal(obj.fields.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should successfully insert content and also convert strings that are valid native dates to a date object.',
            function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue',
                    testDateField: '2014-04-30T20:00:00.000Z',
                    testNested: {
                        dateField: '2014-04-30T20:00:00.000Z'
                    }
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.label.should.equal(obj.fields.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });


        it('should successfully insert content and also convert multis that are strings ' +
                'that are valid native dates to a date object.',
            function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testvalue',
                        testDateField: '2014-04-30T20:00:00.000Z',
                        multi : [
                            {
                                testNested : {
                                    dateField : '2014-04-30T20:00:00.000Z'
                                }
                            }
                        ]
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        _.isDate(payload.fields.multi[0].testNested.dateField).should.equal(true);
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

        it('should successfully insert content and not convert booleans to a date object.', function(done) {
            var obj = {
                meta: {
                    type: '5254908d56c02c076e000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue',
                    testDateField: '2014-04-30T20:00:00.000Z',
                    testNested: {
                        dateField: '2014-04-30T20:00:00.000Z'
                    },
                    booleanfield : true
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.booleanfield.should.equal(true);
                    done();
                },
                function(err){
                    should.not.exist(err);
                    done();
                }
            ).done();
        });

        it('should successfully insert content and not convert strings that end in numbers to a date object.',
            function(done) {
                var obj = {
                    meta: {
                        type: '5254908d56c02c076e000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testvalue',
                        testDateField: '2014-04-30T20:00:00.000Z',
                        testNested: {
                            dateField: '2014-04-30T20:00:00.000Z'
                        },
                        stringnumfield : 'Step 2'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.stringnumfield.should.equal('Step 2');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

        it('should successfully insert content and not convert string numbers to a date object.', function(done) {
            var obj = {
                meta: {
                    type: '5254908d56c02c076e000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue',
                    testDateField: '2014-04-30T20:00:00.000Z',
                    testNested: {
                        dateField: '2014-04-30T20:00:00.000Z'
                    },
                    stringnumfield : '42'
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.stringnumfield.should.equal('42');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 403 because I am trying to insert content in a node that is restricted to me.',
            function(done) {
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

            grasshopper.request(tokens.restrictedEditorToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return 400 because the content type we are using is invalid.', function(done) {
            var obj = {
                meta: {
                    type: '5320ed3fb9c9cb6364e23031',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue'
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('The content type referenced is invalid.');
                }
            ).done(done);
        });

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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
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
                        numfield: -1
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
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
                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.uniquefield1.should.equal('test');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should fail because we just created a record that will conflict.', function(done) {
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

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                    }
                ).done(done);
            });
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
