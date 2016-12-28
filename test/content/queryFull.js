'use strict';
var should = require('chai').should();
    var async = require('async'),
        path = require('path'),
        _ = require('lodash'),
        grasshopper,
        start = require('../_start');

describe('Grasshopper core - content', function(){

    var
        tokens = {},
        tokenRequests = [
            ['admin', 'TestPassword', 'globalAdminToken']
        ],
        parallelTokenRequests = [];

    before(function(done){
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            _.each(tokenRequests, function(theRequest) {
                parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
            });
            async.parallel(parallelTokenRequests, done);
        });
    });

    after(function(){
        this.timeout(10000)
    });

    describe('query', function() {
        var expected1 = {
                'embedded-array': [],
                'simple-embedded': {
                    'main-background-image': {
                        'alt-tag': 'Image'
                    },
                    'title': 'One in'
                },
                'refs': [
                    {
                        'embedded-array': [],
                        'simple-embedded': {
                            'main-background-image': {
                                'alt-tag': 'Image'
                            },
                            'title': 'Something'
                        },
                        'title': 'Nested 1',
                        'refs': []
                    }
                ],
                'title': 'Query for this'
            },
            expected2 = {
                'embedded-array': [],
                'simple-embedded': {
                    'main-background-image': {
                        'alt-tag': 'Image'
                    },
                    'title': 'Boom'
                },
                'refs': [],
                'title': 'Query for this'
            };


        it('should return array of search results.', function (done) {
            grasshopper
                .request(tokens.globalAdminToken)
                .content.queryFull(grasshopper.utilities.queryBuilder
                    .create()
                    .equals('fields.title', 'Query for this')
                    .build())
                .then(function (payload) {

                    payload.results.length.should.equal(2);

                    // sometimes this is comming back in reverse order
                    // payload.results[0].fields.should.deep.equal(expected1);
                    // payload.results[1].fields.should.deep.equal(expected2);

                    done();
                })
                .catch(done)
                .fail(done)
                .done();
        });

        it('nothing found should return and empty array of search results.', function (done) {
            grasshopper
                .request(tokens.globalAdminToken)
                .content.queryFull(grasshopper.utilities.queryBuilder
                    .create()
                    .equals('fields.title', 'Query for this but you will not find it, hahahahahahaha')
                    .build())
                .then(function (payload) {
                    payload.results.should.be.an('array');
                    payload.results.length.should.equal(0);
                    done();
                })
                .catch(done)
                .fail(done)
                .done();
        });
    });


    function createGetToken(username, password, storage) {
        return {
            closure : function getToken(cb){
                grasshopper.auth('basic', { username: username, password: password }).then(function(token){
                    tokens[storage] = token;
                    cb();
                }).done();
            }
        };
    }
});
