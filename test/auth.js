require('chai').should();

describe('Grasshopper core - testing authentications', function(){
    'use strict';

    var grasshopper = require('../lib/grasshopper');

    before(function(){
        grasshopper.configure(function(){
            this.config = {
                "crypto": {
                    "secret_passphrase" : "223fdsaad-ffc8-4acb-9c9d-1fdaf824af8c"
                },
                "db": {
                    "type": "mongodb",
                    "host": "mongodb://localhost:27017/grasshopper",
                    "database": "grasshopper",
                    "username": "",
                    "password": "",
                    "debug": false
                }
            };
        });

    });

    it('not authenticate because user doesn\'t exist', function(done) {
        grasshopper.auth('travis', '12345')
            .then(function(obj){
                obj.should.be.undefined;
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
                obj.should.be.ok;
            })
            .fail(function(err){
                err.should.be.undefined;
            })
            .done(function(){
                done();
            });
    });
});
