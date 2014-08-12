var should = require('chai').should(),
    _ = require('lodash');

describe('Grasshopper core - contentTypes', function () {
    'use strict';

    var grasshopper = require('../lib/grasshopper').init(require('./fixtures/config')),
        path = require('path'),
        testContentTypeId = '524362aa56c02c0703000001',
        anotherTestContentTypeId = '524362aa56c02c0703000123',
        readerToken = '',
        adminToken = '',
        testCreatedContentTypeId = '';

    before(function (done) {
        grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' })
            .then(function(token){
                adminToken = token;
                grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' })
                    .then(function(token){
                        readerToken = token;
                        done();
                    },
                    function (err) {
                        console.log(err);
                    });
            });
    });

    describe('getById', function () {
        it('should return 401 because trying to access unauthenticated', function (done) {
            grasshopper.request().contentTypes.getById(testContentTypeId).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return an existing content type', function (done) {
            grasshopper.request(adminToken).contentTypes.getById(testContentTypeId).then(
                function (payload) {
                    payload._id.toString().should.equal(testContentTypeId);
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });
        it('should return 404 because test user id does not exist', function (done) {
            grasshopper.request(adminToken).contentTypes.getById('5246e73d56c02c0744000004').then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(404);
                }
            ).done(done);
        });
    });

    describe('get list', function () {
        it('should return a list of content types with the default page size', function (done) {
            grasshopper.request(adminToken).contentTypes.list().then(
                function (payload) {
                    payload.results.length.should.equal(9);
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });
        it('should a list of content types with the specified page size', function (done) {
            grasshopper.request(adminToken).contentTypes.list({limit: 1}).then(
                function (payload) {
                    payload.results.length.should.equal(1);
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return an empty list if the page size and current requested items are out of bounds.', function (done) {
            grasshopper.request(adminToken).contentTypes.list({limit: 20, skip: 100}).then(
                function (payload) {
                    payload.results.length.should.equal(0);
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return the results sorted alphabetically by label', function (done) {

            var label = "aaaaaa",
                newContentType = {
                    "label": label,
                    "fields": [
                        {
                            "label": label,
                            "max": 1,
                            "min": 1,
                            "options": false,
                            "type": "textbox",
                            "validation": [],
                            "_id": "title"
                        },
                        {
                            "label": "Something",
                            "max": 1,
                            "min": 1,
                            "options": false,
                            "type": "textbox",
                            "validation": [
                                {
                                    "type": "alpha",
                                    "options": {
                                        "min": "5",
                                        "max": "5"
                                    }
                                }
                            ],
                            "_id": "something"
                        }
                    ]
                };

            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function () {
                    grasshopper.request(adminToken).contentTypes.list().then(
                        function (payload) {
                            payload.results[0].label.should.equal(label);
                        },
                        function (err) {
                            should.not.exist(err);
                        }
                    ).done(done);
                },
                function (err) {
                    should.not.exist(err);
                }
            );
        });

        it('should return a 401 because user is not authenticated', function (done) {
            grasshopper.request().contentTypes.list().then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(401);
                }
            ).done(done);
        });
    });

    describe('insert', function () {

        it('should insert a new contentType with the new schema', function (done) {
            var newContentType = {
                "label": "Test Type",
                "fields": [
                    {
                        "label": "Title",
                        "max": 1,
                        "min": 1,
                        "options": false,
                        "type": "textbox",
                        "validation": [],
                        "_id": "title"
                    },
                    {
                        "label": "Something",
                        "max": 1,
                        "min": 1,
                        "options": false,
                        "type": "textbox",
                        "validation": [
                            {
                                "type": "alpha",
                                "options": {
                                    "min": "5",
                                    "max": "5"
                                }
                            }
                        ],
                        "_id": "something"
                    }
                ]
            };

            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function (payload) {
                    payload.label.should.equal(newContentType.label);
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should insert a content type', function (done) {
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: [
                    {
                        _id: 'testfield',
                        label: 'Title',
                        type: 'textbox'
                    }
                ],
                helpText: '',
                description: ''
            };
            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function (payload) {
                    payload.label.should.equal(newContentType.label);
                    testCreatedContentTypeId = payload._id;
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return an error because we are missing a "label" field.', function (done) {
            var newContentType = {
                fields: {
                    testid: {
                        required: true,
                        label: 'Title',
                        instancing: 1,
                        type: 'textbox'
                    }
                },
                helpText: '',
                meta: [],
                description: ''
            };
            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(400);
                    err.message.should.equal('"label" is a required field.');
                }
            ).done(done);
        });

        it('should return error when a malformed key is passed in (key has a space).', function (done) {
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: [
                    {
                        "la bel": 'This is a test label',
                        required: true,
                        instancing: 1,
                        type: 'textbox'
                    }
                ],
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });

        it('should return error when a malformed field is passed in (missing label).', function (done) {
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: [
                    {
                        required: true,
                        instancing: 1,
                        type: 'textbox'
                    }
                ],
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });

        it('should return error when a malformed field is passed in (missing type).', function (done) {
            var newContentType = {
                label: 'newtestsuitecontent',
                fields: [
                    {
                        label: 'Test Field Label',
                        required: true,
                        instancing: 1
                    }
                ],
                helpText: '',
                meta: [],
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.insert(newContentType).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(400);
                    err.message.should.equal('Invalid Field Object');
                }
            ).done(done);
        });

        it('should add a unique id to each field.', function(done){
            var testContentType = {
                "label" : "new test content type",
                "fields" : [
                    {
                        "dataType" : "string",
                        "defaultValue" : "",
                        "_id" : "title",
                        "validation" : [],
                        "type" : "textbox",
                        "options" : false,
                        "min" : 1,
                        "max" : 1,
                        "label" : "Title"
                    },
                    {
                        "dataType" : "date",
                        "_id" : "a-date",
                        "validation" : [],
                        "type" : "date",
                        "options" : false,
                        "min" : 1,
                        "max" : 1,
                        "label" : "a date"
                    },
                    {
                        "dataType" : "boolean",
                        "_id" : "a-radio",
                        "validation" : [],
                        "type" : "radio",
                        "options" : false,
                        "min" : 1,
                        "max" : 1,
                        "label" : "a radio"
                    }
                ]
            };
            grasshopper.request(adminToken).contentTypes.insert(testContentType)
                .then(
                    function (payload) {
                        _.each(payload.fields, function(field){
                            field.should.have.ownProperty('_uid');
                        });
                        done();
                    }
                )
                .catch(doneError.bind(null, done))
                .fail(doneError.bind(null, done))
                .done();

        });
    });

    describe('update', function () {
        before(function (done) {
            grasshopper.request(adminToken).content.insert({
                meta: {
                    type: testCreatedContentTypeId,
                    node: '526d5179966a883540000006',
                    labelfield: 'label'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testtest',
                    alphanumfield: 'tes123fdsfafsdafdsafsdafasfdsaest'
                }
            }).then(
                function () {
                    done();
                });
        });

        it('should return a 403 because user does not have permissions to access users', function (done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [
                    {
                        _id:'testfield',
                        required: true,
                        label: 'Title'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(readerToken).contentTypes.update(newContentType).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should update a content type', function (done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testttt',
                        label: 'Test Field Label',
                        type: 'textbox'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType)
                .then(
                    function (payload) {
                        payload.label.should.equal(newContentType.label);
                        done();
                    }
                )
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should add a UID if any field is added or missing one.', function (done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testttt',
                        label: 'Test Field Label',
                        type: 'textbox'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType)
                .then(
                function (payload) {
                    payload.fields[0].should.ownProperty('_uid');
                    done();
                }
            )
                .fail(doneError.bind(null, done))
                .catch(doneError.bind(null, done))
                .done();
        });

        it('should return error if content type is updated without a set "ID"', function (done) {
            var newContentType = {
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testid',
                        label: 'Test Field Label',
                        type: 'textbox'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType).then(
                function (payload) {
                    payload.should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(404);
                }
            ).done(done);
        });

        it('should update content field ids on content if a contenttype field id is changed.', function(done){
            var valueToLookFor = 'superfunky',
                valueToLookFor2 = 'wakka',
                valueToLookFor3 = 'testtest',
                contentToQueryId = '',
                testContentType = {
                "label" : "new test content type",
                "fields" : [
                    {
                        "dataType" : "string",
                        "defaultValue" : "",
                        "_id" : "title",
                        "validation" : [],
                        "type" : "textbox",
                        "options" : false,
                        "min" : 1,
                        "max" : 1,
                        "label" : "Title"
                    },
                    {
                        "dataType" : "date",
                        "_id" : "a-date",
                        "validation" : [],
                        "type" : "date",
                        "options" : false,
                        "min" : 1,
                        "max" : 1,
                        "label" : "a date"
                    },
                    {
                        "dataType" : "boolean",
                        "_id" : "a-radio",
                        "validation" : [],
                        "type" : "radio",
                        "options" : false,
                        "min" : 1,
                        "max" : 1,
                        "label" : "a radio"
                    }
                ]
            };

            grasshopper.request(adminToken).contentTypes.insert(testContentType)
                .then(function (createdContentType) {

                    var testContent = {
                        "fields":{
                            "a-radio":false,
                            "a-date":"2014-02-22T08:00:00.000Z",
                            "title":"jiggity"
                        },
                        "meta":{
                            "node":"53cece8de1c9ff0b00e6b4a3",
                            "type":createdContentType._id,
                            "labelfield":"title",
                            "typelabel":"new test content type",
                            "created":"2014-08-11T19:24:54.138Z",
                            "lastmodified":"2014-08-11T19:24:54.137Z"
                        }
                    };

                    grasshopper.request(adminToken).content.insert(testContent)
                        .then(function (createdContent) {
                            contentToQueryId = createdContent._id;

                            createdContentType.fields[0]._id = valueToLookFor;
                            createdContentType.fields[0].label = 'newLabel';
                            createdContentType.fields[1]._id = valueToLookFor2;
                            createdContentType.fields[2]._id = valueToLookFor3;

                            grasshopper.request(adminToken).contentTypes.update(createdContentType)
                                .then(function () {

                                    grasshopper.request(adminToken).content.getById(contentToQueryId)
                                        .then(function (foundContent) {
                                            _.has(foundContent.fields, valueToLookFor).should.be.ok;
                                            _.has(foundContent.fields, valueToLookFor2).should.be.ok;
                                            _.has(foundContent.fields, valueToLookFor3).should.be.ok;
                                            done();
                                        }
                                    )
                                    .catch(doneError.bind(null, done))
                                    .fail(doneError.bind(null, done))
                                    .done();
                                }
                            )
                            .catch(doneError.bind(null, done))
                            .fail(doneError.bind(null, done))
                            .done();
                        }
                    )
                    .catch(doneError.bind(null, done))
                    .fail(doneError.bind(null, done))
                    .done();
                }
            )
            .catch(doneError.bind(null, done))
            .fail(doneError.bind(null, done))
            .done();
        });

        describe('updating the fields array on a content type', function() {

            it('should update the meta.labelfield when the order of fields changed', function(done) {
                var updatedContentType = {
                    _id: anotherTestContentTypeId,
                    label: 'updatedlabel',
                    fields: [
                        { // The order of these has been swapped.
                            _id: "testeroni",
                            required: true,
                            instancing: 1,
                            type: "textbox",
                            label: "Title"
                        },
                        {
                            _id: "testfield",
                            required: true,
                            instancing: 1,
                            type: "textbox",
                            label: "Title"
                        }
                    ],
                    helpText: '',
                    description: ''
                };

                grasshopper.request(adminToken).contentTypes.update(updatedContentType)
                    .then(function () {
                        grasshopper.request(adminToken).content.getById('5246e73d56c02c0744000001')
                            .then(function(payload) {
                                payload.meta.labelfield.should.equal('testeroni');
                                done();
                            })
                            .fail(doneError.bind(null, done))
                            .catch(doneError.bind(null, done))
                            .done();
                    })
                    .fail(doneError.bind(null, done))
                    .catch(doneError.bind(null, done))
                    .done();
            });

            it('should remove a field from a content type when you do a PUT without that field', function(done) {
                var updatedContentType = {
                    _id: anotherTestContentTypeId,
                    label: 'updatedlabel',
                    fields: [
                        {
                            _id: "testfield",
                            required: true,
                            instancing: 1,
                            type: "textbox",
                            label: "Title"
                        }
                    ],
                    helpText: '',
                    description: ''
                };

                grasshopper.request(adminToken).contentTypes.update(updatedContentType)
                    .then(function (payload) {
                        payload.fields.length.should.equal(1);
                        done();
                    })
                    .fail(doneError.bind(null, done))
                    .catch(doneError.bind(null, done))
                    .done();
            });

            it('should throw an error when attempting to remove all of the fields with a PUT', function(done) {
                var updatedContentType = {
                    _id: anotherTestContentTypeId,
                    label: 'updatedlabel',
                    fields: [], //empty fields object
                    helpText: '',
                    description: ''
                };

                grasshopper.request(adminToken).contentTypes.update(updatedContentType)
                    .then(doneError.bind(null, done))
                    .fail(function(err) {
                        err.code.should.equal(404);
                        done();
                    })
                    .catch(doneError.bind(null, done))
                    .done();
            });

        });

    });

    describe('deleteById', function () {
        before(function (done) {
            grasshopper.request(adminToken).content.insert({
                "label": "Future deletee",
                "type": testCreatedContentTypeId,
                "fields": {
                    "testfield": "test value"
                },
                "node": {
                    "_id": '526d5179966a883540000006',
                    "displayOrder": 1
                }
            }).then(
                function (payload) {
                    done();
                },
                function (err) {
                    done();
                }
            ).done();
        });

        it('should return a 403 because user does not have permissions to access content types', function (done) {
            grasshopper.request(readerToken).contentTypes.deleteById(testCreatedContentTypeId).then(
                function (payload) {
                    should.not.exist(payload);
                },
                function (err) {
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should delete a content type', function (done) {
            grasshopper.request(adminToken).contentTypes.deleteById(testCreatedContentTypeId).then(
                function (payload) {
                    payload.should.equal('Success');
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 200 when we try to delete a content type that doesn\'t exist', function (done) {
            grasshopper.request(adminToken).contentTypes.deleteById(testCreatedContentTypeId).then(
                function (payload) {
                    payload.should.equal('Success');
                },
                function (err) {
                    should.not.exist(err);
                }
            ).done(done);
        });
    });


});

function doneError(done, err) {
    'use strict';
    done(err);
}
