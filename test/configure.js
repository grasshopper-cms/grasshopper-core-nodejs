'use strict';

var should = require('chai').should(),
    grasshopper = require('../lib/grasshopper'),
    path = require('path');

describe('configuration', function(){

    describe('using a passed in context', function() {
        it('can configure grasshopper core using a passed in context if the configure method has a length', function(done) {
            grasshopper.configure(function(core){
                core.config = configObj();
            });
            grasshopper.auth('Basic', { username: 'admin', password: 'TestPassword' })
                .then(function(obj){
                    should.exist(obj);
                })
                .done(function(){
                    done();
                });
        });
    });

    describe('using a bound context', function() {
        it('can configure grasshopper core using, "this" if the configure method has no length', function(done) {
            grasshopper.configure(function(){
                this.config = configObj();
            });

            grasshopper.auth('Basic', { username: 'admin', password: 'TestPassword' })
                .then(function(obj){
                    should.exist(obj);
                })
                .done(function(){
                    done();
                });
        });
    });
});

function configObj() {
    return {
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
}