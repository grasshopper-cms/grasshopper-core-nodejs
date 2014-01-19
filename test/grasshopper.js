require('chai').should();
'use strict';

describe('Grasshopper core - functional parts', function(){
    var grasshopper = require('../lib/grasshopper');

    describe('chain', function() {
        it('test', function(done) {
            grasshopper.configure(function(){
                this.config = {
                    "crypto": {
                        "secret_passphrase" : "223fdsaad-ffc8-4acb-9c9d-1fdaf824af8c"
                    },
                    "db": {
                        "type": "mongodb",
                        "host": "mongodb://localhost:27017/test",
                        "database": "test",
                        "username": "",
                        "password": "",
                        "debug": false
                    }
                };
            });

            setTimeout(function(){
                grasshopper.auth('travis', '12345')
                    .then(function(obj){
                        done();
                    })
                    .fail(function(err){
                        done();
                    });
            },300);

/*
            grasshopper.use(1)
                .users
                .create({a:'12345'})
                .then(function(){

                    console.log('finished');
                    done();
                })
                .fail(function(){
                    console.log('error');
                    done();
                });*/

        });
    });

});
