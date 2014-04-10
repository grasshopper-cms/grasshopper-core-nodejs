var should = require('chai').should();

describe('Grasshopper core - testing event events', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper'),
        path = require('path');

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

        grasshopper.event.channel('/system/db').on('start', function(payload, next){
            next();
        });

        done();
    });

    describe('Content Events', function(){
        var token;

        before(function(done){
            grasshopper.auth('apitestusereditor', 'TestPassword').then(function(payload){
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
                    type: '524362aa56c02c0703000001',
                    node : {_id: '526d5179966a883540000006', displayOrder: 1},
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
                        type: '524362aa56c02c0703000001',
                            node : {_id: '526d5179966a883540000006', displayOrder: 1},
                        fields: {
                            testfield:'aaaaaa'
                        }
                    };

                    next();
                });

                grasshopper.request(token).content.insert({label:'thisismybadinput', type: '524362aa56c02c0703000001'}).then(
                    function(payload){
                        payload.fields.testfield.should.equal('aaaaaa');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').remove('parse');
            });
        });

        describe('Testing content validation', function(){
            it('should fail because we throw a specific validation error', function(done){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').on('validate', function(payload, next){
                    next(new Error('This is my custom validation error'));
                });

                grasshopper.request(token).content.insert({
                    type: '524362aa56c02c0703000001',
                    node : {_id: '526d5179966a883540000006', displayOrder: 1},
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
                grasshopper.event.channel('/type/524362aa56c02c0703000001').remove('validate');
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
                    type: '524362aa56c02c0703000001',
                    node : {_id: '526d5179966a883540000006', displayOrder: 1},
                    fields: {
                        testfield:'abcdefg'
                    }
                }).then(
                    function(payload){
                        payload.custom.should.equal('payload')
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').remove('out');
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
                    type: '524362aa56c02c0703000001',
                    node : {_id: '526d5179966a883540000006', displayOrder: 1},
                    fields: {
                        testfield:'abcdefg'
                    }
                }).done();
            });

            afterEach(function(){
                grasshopper.event.channel('/type/524362aa56c02c0703000001').remove('save');
            });
        });
    });
});