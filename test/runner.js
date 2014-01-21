require('chai').should();

describe('Grasshopper core - runner', function(){
    'use strict';

    var runner = require('../lib/runner');

    it('runner should see the changes made to kontx by it\' middleware.', function(done) {
        runner.use('users.create', [
            function(kontx, next){
                kontx.test = 0;
                next();
            },
            function(kontx, next){
                kontx.a = 1;
                next();
            }
        ]);

        runner.handle('users.create', {}).then(function(kontx){
                kontx.test.should.equal(0);
                kontx.a.should.equal(1);
            }).done(function(){
                done();
            });
    });

    it('runner should notify when there is an error in the chain.', function(done) {
        runner.use('users.create', [
            function(kontx, next){
                kontx.test = 0;
                next(new Error('ERROR!!!!'));
            },
            function(kontx, next){
                kontx.ab = 1;
                next();
            }
        ]);

        runner.handle('users.create', {})
            .then(function(kontx){
                kontx.ab.should.not.equal(1);
            })
            .fail(function(e){
                e.should.not.be.undefined;
            }).done(function(err){
                done();
            });
    });

});
