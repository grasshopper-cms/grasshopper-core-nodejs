'use strict';
var should = require('chai').should(),
    path = require('path'),
    grasshopper,
    start = require('./_start');

describe('Grasshopper core - testing channels', function(){

    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) { grasshopper = gh; done(); });
    });
    after(function(){
        this.timeout(10000);
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
