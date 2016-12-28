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
            ['apitestuseradmin', 'TestPassword', 'globalAdminToken'],
            ['apitestuserreader', 'TestPassword', 'globalReaderToken'],
            ['apitestusereditor_restricted', 'TestPassword', 'restrictedEditorToken'],

            // There are no tests for the following:
            ['apitestusereditor', 'TestPassword', 'globalEditorToken'],
            ['apitestuserreader_1', 'TestPassword', 'nodeEditorToken']
        ],
        parallelTokenRequests = [];

    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) {
            grasshopper = gh;
            _.each(tokenRequests, function(theRequest) {
                parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
            });
            async.parallel(parallelTokenRequests, insertContent.bind(null, done));
        });

    });

    after(function(){
        this.timeout(10000);
    });
    
    describe('query', function() {
        var query = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test1'}]
            },
            query2 = {
                filters: [{key: 'nonsense', cmp: '=', value: 'XXXNEVERSHOULDMATCHANTYHINGXXX'}],
                options: {}
            },
            query3 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test2'}],
                options: {
                    include: ['fields.testfield']
                }
            },
            query4 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test3'}],
                options: {
                    exclude: ['fields.newColumn']
                }
            },
            query5 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test4'}],
                options: {
                    sortBy: '1111'
                }
            },
            query6 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test5'}],
                options: {}
            },
            query7 = {
                filters: [],
                nodes: ['526d5179966a883540000006']
            },
            query8 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test6'}],
                options : {
                    limit : 1
                }
            },
            query9 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test6'}],
                options : {
                    limit : '1'
                }
            },
            query10 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test6'}],
                options : {
                    limit : 'string'
                }
            },
            query11 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test7'}],
                options : {
                    limit : 1,
                    skip : 2
                }
            },
            query12 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test7'}],
                options : {
                    limit : 1,
                    skip : '2'
                }
            },
            query13 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test7'}],
                options : {
                    limit : 1,
                    skip : 'string'
                }
            },
            query14 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test7'}],
                options : {
                    limit : 1,
                    skip : -1
                }
            },
            query15 = {
                filters: [ { key: ['fields.othertestfield', 'fields.testfield'], cmp: '=', value: 'customtestvalue'}],
                options : {
                    limit : 20
                }
            };

        before(function(done){
            var base = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                }
            };

            grasshopper.request(tokens.globalEditorToken)
                .content.insert(_.extend({
                    fields:{
                        label:'search test1'
                    }
                }, base))
                .then(function(){
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test2',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test3',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test4',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test5',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test6',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test6',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test7',
                            testfield: 'testvalue',
                            newColumn: 'testvalue',
                            thisShouldBeOnOneOfThese : true,
                            first : true
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test7',
                            testfield: 'testvalue',
                            newColumn: 'testvalue',
                            thisShouldBeOnOneOfThese : true,
                            second : true
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test7',
                            testfield: 'testvalue',
                            newColumn: 'testvalue',
                            thisShouldBeOnOneOfThese : true,
                            third : true
                        }
                    }, base));
                })
                .done(done.bind(done, undefined));
        });

        it('should not a 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().content.query(query).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return array of search results.', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query).then(
                function(payload){
                    payload.results.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('test "including" fields in a query', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query3).then(
                function(payload){
                    payload.results.length.should.equal(1);
                    payload.results[0].fields.testfield.should.equal('testvalue');
                    payload.results[0].fields.should.not.have.property('newColumn');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('test "excluding" fields in a query', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query4).then(
                function(payload){
                    payload.results.length.should.equal(1);
                    payload.results[0].fields.should.have.property('testfield');
                    payload.results[0].fields.should.not.have.property('newColumn');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return empty results if it finds nothing', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query2).then(
                function(payload){
                    payload.results.length.should.equal(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        // Commented this one out because it was causing the test below to fall saying that callback had already been called
        // it('if options.sortBy is not an object, throw an error. ', function(done) {
        //     grasshopper.request(tokens.globalReaderToken).content.query(query5)
        //         .then(done)
        //         .fail(function(err) {
        //             done();
        //         });
        // });

        it('return valid results even if options is an empty object', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query6)
                .then(function(payload){
                    payload.results.length.should.equal(1);
                    done();
                })
                .fail(function(err){
                    should.not.exist(err);
                    done();
                });
        });

        it('return valid results for everything within a node', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query7)
                .then(function(payload){
                    payload.total.should.be.greaterThan(0);
                    done();
                })
                .catch(done)
                .fail(done)
                .done();
        });

        it('returns distinct values within a find', function(done) {
            grasshopper
                .request(tokens.globalReaderToken)
                .content.query({
                    filters: [{key: 'meta.type', cmp: '=', value: '524362aa56c02c0703000001'}],
                    options: {
                        distinct : 'fields.label'
                    }
                })
                .then(function(payload){
                    var ary = [
                        'Generated title',
                        'search test1',
                        'search test2',
                        'search test3',
                        'search test4',
                        'search test5',
                        'search test6',
                        'search test7'
                    ];

                    _.difference(payload.results, ary).should.deep.equal([]);

                    done();
                })
                .catch(done)
                .fail(done)
                .done();
        });

        it('distinct works with types', function(done) {
            grasshopper
                .request(tokens.globalReaderToken)
                .content.query({
                    types : ['524362aa56c02c0703000001'],
                    options: {
                        distinct : 'fields.label'
                    }
                })
                .then(function(payload){
                    var ary = [
                        'Generated title',
                        'search test1',
                        'search test2',
                        'search test3',
                        'search test4',
                        'search test5',
                        'search test6',
                        'search test7'
                    ];

                    _.difference(payload.results, ary).should.deep.equal([]);

                    done();
                })
                .catch(done)
                .fail(done)
                .done();
        });

        describe('options.limit eq number', function() {
            it('should limit the results, based on the options.limit', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query8)
                    .then(function(payload){
                        payload.results.length.should.equal(1);

                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('options.limit eq string parsed to number', function() {
            it('should limit the results, based on the options.limit', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query9)
                    .then(function(payload){
                        payload.results.length.should.equal(1);

                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('options.limit eq string', function() {
            it('should use default if options.limit has a string value', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query10)
                    .then(function(payload){
                        payload.limit.should.eq(100000);

                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('options.skip eq number', function() {
            it('should skip the results, based on the options.limit and options.skip', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query11)
                    .then(function(payload){
                        payload.results.length.should.equal(1);
                        payload.results[0].fields.should.have.property('third');
                        payload.results[0].fields.third.should.equal(true);

                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('options.skip eq string parsed to number', function() {
            it('should skip the results, based on the options.limit and options.skip', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query12)
                    .then(function(payload){
                        payload.results.length.should.equal(1);
                        payload.results[0].fields.should.have.property('thisShouldBeOnOneOfThese');

                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('options.skip eq string', function() {
            it('should use default if options.skip has a string value', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query13)
                    .then(function(payload){
                        payload.skip.should.eq(0);

                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('options.skip eq string', function() {
            it('should ignore negative values', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query14)
                    .then(function(payload){
                        payload.should.be.ok;
                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('search with an array of keys', function() {
            it('should ignore negative values', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query15)
                    .then(function(payload){
                        payload.should.be.ok;
                        payload.total.should.equal(2);
                        done();
                    })
                    .fail(done)
                    .catch(done)
                    .done();
            });
        });

        describe('like (%) operator', function() {
            it ('accepts a regular expression as a value', function (done) {
                grasshopper.request(tokens.globalAdminToken).content.query({
                    filters: [{ key: 'fields.label', cmp: '%', value: /test(1|2)/ }]
                }).then(function (results) {
                    results.should.be.ok;
                    results.total.should.equal(2);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
            });

            it ('should apply a case insensitive search when a string is supplied as a value', function (done) {
                grasshopper.request(tokens.globalAdminToken).content.query({
                    filters : [{key : 'fields.label', cmp : '%', value : 'TEST1'}]
                }).then(function (results) {
                    results.should.be.ok;
                    results.total.should.equal(1);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
            });
        });

        describe('notlike (!%) operator', function() {
            it ('accepts a regular expression as a value', function (done) {
                grasshopper.request(tokens.globalAdminToken).content.query({
                    filters: [{ key: 'fields.label', cmp: '!%', value: /search test7/ }]
                }).then(function (results) {
                    results.should.be.ok;
                    results.total.should.equal(20);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
            });

            it ('should apply a case insensitive search when a string is supplied as a value', function (done) {
                grasshopper.request(tokens.globalAdminToken).content.query({
                    filters : [{key : 'fields.label', cmp : '!%', value : 'search'}]
                }).then(function (results) {
                    results.should.be.ok;
                    results.total.should.equal(13);
                    done();
                })
                .fail(done)
                .catch(done)
                .done();
            });
        });

        describe('or query', function() {

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

    function insertContent(done) {
        var obj = {
            meta: {
                type: '524362aa56c02c0703000001',
                node : '526d5179966a883540000006',
                labelfield: 'testfield'
            },
            fields: {
                label: 'Generated title',
                testfield: 'testvalue'
            }
        };

        grasshopper
            .request(tokens.globalEditorToken)
            .content.insert(obj)
            .done(done.bind(done, undefined));
    }
});
