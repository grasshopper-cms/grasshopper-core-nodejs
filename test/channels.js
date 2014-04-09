var should = require('chai').should();

describe('Grasshopper core - testing events', function(){
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

        grasshopper.event.channel('/system/*').on('error', function(payload, next){
            console.log(payload);
        });

        grasshopper.event.channel('/system/db').on('start', function(payload, next){

            next();
        });
        done();
    });

    describe('Registering channels', function(){
        it('I should be able to register a channel and fire and event and get the result.', function(done){
            grasshopper.event.channel('/type/1').on('save', function(payload, next){
                payload.should.equal(true);
                next();
            });

            grasshopper.event.emit('save', { type:'1' }, true).then(
                function(){

                },
                function(err){
                    should.not.exist(err);
                }).done(done);
        });
    });

    describe('Test validation event emitter', function(){
        it('I should be able to register a channel and fire and event and get the result.', function(done){
            grasshopper.event.channel('/type/1').on('validate', function(payload, next){
                payload.should.equal(true);
                next();
            });

            grasshopper.event.emit('validate', { type:'1' }, true).then(
                function(){

                },
                function(err){
                    should.not.exist(err);
                }).done(done);
        });
    });
});
