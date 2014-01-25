var should = require('chai').should();

describe('Grasshopper core - testing authentications', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper');

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
                }
            };
        });
        done();
    });

    it('not authenticate because user doesn\'t exist', function(done) {
        grasshopper.auth('travis', '12345')
            .then(function(obj){
                should.not.exist(obj);
            })
            .fail(function(err){
                err.message.should.equal('User does not exist');
            })
            .done(function(){
                done();
            });
    });

    it('should authenticate with a valid user.', function(done) {
        grasshopper.auth('admin', 'TestPassword')
            .then(function(obj){
                should.exist(obj);
            })
            .fail(function(err){
                should.not.exist(err);
            })
            .done(function(){
                done();
            });
    });
});
