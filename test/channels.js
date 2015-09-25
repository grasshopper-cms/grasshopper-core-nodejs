'use strict';
var should = require('chai').should(),
    path = require('path'),
    grasshopper = require('../lib/grasshopper').init(require('./fixtures/config')),
    start = require('./_start');

start(grasshopper).then(run);


describe('Grasshopper core - testing channels', function(){


    before(function(done){
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

            grasshopper
                .event.emit('save', { type:'1' }, true)
                .then(done.bind(null, null))
                .fail(done)
                .catch(done)
                .done();
        });
    });

    describe('Test validation event emitter', function(){
        it('I should be able to register a channel and fire and event and get the result.', function(done){
            grasshopper.event.channel('/type/1').on('validate', function(payload, next){
                payload.should.equal(true);
                next();
            });

            grasshopper
                .event.emit('validate', { type:'1' }, true)
                .then(done.bind(null, null))
                .fail(done)
                .catch(done)
                .done();
        });
    });
});

