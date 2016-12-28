'use strict';
var should = require('chai').should(),
    grasshopper,
    path = require('path'),
    _ = require('lodash'),
    start = require('./_start');

describe('Grasshopper core - testing event events', function(){

    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            grasshopper.event.channel('/system/db').on('start', function(payload, next){
                next();
            });

            done();
        });
    });

    after(function(){
        this.timeout(10000);
    });
    
    describe('Content Events', function(){
        var token;

        before(function(done){
            grasshopper.auth('username', { username: 'apitestusereditor', password: 'TestPassword' }).then(function(payload){
                token = payload;
            }).done(done);
        });

        describe('Testing content parsing', function(){
            it('should intercept and parse the kontx and change a property', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('parse', function(payload, next){
                    payload.args.fields.testfield = 'aaaaaa';
                    next();
                });

                grasshopper.request(token).content.insert({
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        testfield:'abcdefg'
                    }
                }).then(
                    function(payload){
                        payload.fields.testfield.should.equal('aaaaaa');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('accept a completely incorrect data type and parse it into a valid data type.', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('parse', function(payload, next){
                    payload.args = {
                        meta: {
                            type: '524362aa56c02c0703000001',
                            node : '526d5179966a883540000006',
                            labelfield: 'testfield'
                        },
                        fields: {
                            testfield:'aaaaaa'
                        }
                    };

                    next();
                });

                grasshopper.request(token).content.insert({label:'thisismybadinput', meta: {type: '524362aa56c02c0703000001'}}).then(
                    function(payload){
                        payload.fields.testfield.should.equal('aaaaaa');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('parse');
            });
        });

        describe('Testing content validation', function(){
            it('should fail because we throw a specific validation error', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('validate', function(payload, next){
                    next(new Error('This is my custom validation error'));
                });

                grasshopper.request(token).content.insert({
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        testfield:'abcdefg'
                    }
                }).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.message.should.equal('This is my custom validation error');
                    }
                ).done(done);
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('validate');
            });
        });

        describe('Testing manipulation on the way out', function(){
            it('out should manipulate the outputed payload', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('out', function(payload, next){
                    payload.payload = {
                        custom: 'payload'
                    };
                    next();
                });

                grasshopper.request(token).content.insert({
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        testfield:'abcdefg'
                    }
                }).then(
                    function(payload){
                        payload.custom.should.equal('payload');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('out');
            });
        });

        describe('Testing getting a save event with the saved content.', function(){
            it('out should manipulate the outputed payload', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('save', function(kontx, next){
                    kontx.payload.fields.testfield.should.equal('abcdefg');
                    next();
                    done();
                });

                grasshopper.request(token).content.insert({
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        testfield:'abcdefg'
                    }
                }).done();
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('save');
            });
        });

        describe('When updating all events should get called.', function(){
            var sampleContentObject;

            before(function(done){
                grasshopper.request(token).content.getById('5261781556c02c072a000007').then(
                    function(payload){
                        sampleContentObject = payload;
                    }).done(done);
            });

            it('out should manipulate the outputed payload', function(done){

                var obj = {},
                    eventCount = 0;
                _.extend(obj, sampleContentObject);

                grasshopper.event.channel('/type/524362aa56c02c0703000001/contentid/5261781556c02c072a000007').on('parse', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('parse', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('validate', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('out', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('save', function(kontx, next){
                    eventCount++;
                    eventCount.should.equal(5);
                    done();
                    next();
                });

                grasshopper.request(token).content.update(obj).done();
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001/contentid/5261781556c02c072a000007').off('parse');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('parse');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('validate');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('out');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('save');
            });
        });

        describe('When deleting data all events should get called.', function(){
            var contentid,
                eventCount = 0;

            before(function(done){
                grasshopper.request(token).content.insert({
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        testfield:'abcdefg'
                    }
                }).then(
                    function(payload){
                        contentid = payload._id.toString();
                    }
                ).done(done);
            });

            it('out should manipulate the outputed payload', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('parse', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('validate', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('out', function(kontx, next){
                    eventCount++;
                    next();
                });

                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('delete', function(kontx, next){
                    eventCount++;
                    eventCount.should.equal(4);
                    done();
                    next();
                });

                grasshopper.request(token).content.deleteById(contentid).done();
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('parse');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('validate');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('out');
                grasshopper.event.channel('/type/524362aa56c02c0703000001').off('delete');
            });
        });
    });
});
