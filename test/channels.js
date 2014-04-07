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
        done();
    });

    describe('Registering channels', function(){
        it('I should be able to register a channel and fire and event and get the result.', function(){
            grasshopper.event.channel('/type/1').on('save', function(payload){
                console.log('callback');
                payload.should.equal(true);
            });

            grasshopper.event.emit('save', {
                type:'1'
            }, true);
        });
    });
});
