'use strict';
var should = require('chai').should(),
    coordinator = require('../lib/runners/coordinator');

describe('Grasshopper core - coordinator', function(){


    it('coordinator should see the changes made to kontx by it\' middleware.', function(done) {
        coordinator.use('example.method', [
            function(kontx, next){
                kontx.payload.test = 0;
                next();
            },
            function(kontx, next){
                kontx.payload.a = 1;
                next();
            }
        ]);

        coordinator.handle('example.method', {payload:{}}).then(function(payload){
            payload.test.should.equal(0);
            payload.a.should.equal(1);
        }).done(function(){
            done();
        });
    });

    it('coordinator should notify when there is an error in the chain.', function(done) {
        coordinator.use('example.method', [
            function(kontx, next){
                kontx.payload.test = 0;
                next(new Error('ERROR!!!!'));
            },
            function(kontx, next){
                kontx.payload.ab = 1;
                next();
            }
        ]);

        coordinator.handle('example.method', {payload:{}})
            .then(function(payload){
                should.not.exist(payload);
            })
            .fail(function(e){
                should.exist(e);
            }).done(done);
    });
});
