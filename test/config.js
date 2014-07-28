'use strict';

var should = require('chai').should(),
    Config = require('../lib/config'),
    path = require('path');

describe('config', function(){

    describe('using empty config options', function() {
        var config;

        beforeEach(function(){
            config = new Config();
        });

        it('an empty config should return back the default object', function() {
            config.db.defaultPageSize.should.equal(100000);
        });

        it('calling the init function with a different default page size should override what was previously in there.', function(){
            config.init({db:{defaultPageSize: 20}});
            config.db.defaultPageSize.should.equal(20);
        });
    });

    describe('fully constructing a config object', function() {
        it('options should be set on construction', function() {
            var config = new Config(configObj());
            config.db.defaultPageSize.should.equal(20);
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
            'defaultPageSize':20,
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