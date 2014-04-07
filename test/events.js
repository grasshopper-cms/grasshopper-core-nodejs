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

    it('not authenticate because user doesn\'t exist', function(done) {
        grasshopper.event.channel('/node/testnodeid/type/testtypeid').on('save', function(){

        });

        grasshopper.event.channel('/node/testnodeid/type/testtypeid').on('save', function(){

        });

        grasshopper.event.emit('save', {
                node:'testnodeid'
            },{
                payload: 'object'
            });
    });
});
