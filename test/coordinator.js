require('chai').should();

describe('Grasshopper core - coordinator', function(){
    'use strict';

    var coordinator = require('../lib/runners/coordinator');

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
                payload.ab.should.not.equal(1);
            })
            .fail(function(e){
                e.should.be(Error);
            }).done(done);
    });


    it('coordinator should be able to register multiple methods with a specified set of firmware and process them as a batch.', function(done){
       true.should.equal(false);
        done();
    });
});
