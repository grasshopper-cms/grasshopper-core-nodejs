var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';
    
    var grasshopper = require('../../lib/grasshopper').init(require('../fixtures/config')),
        path = require('path'),
        readerToken = '',
        adminToken = '',
        expectedImage = {
            '_id': '53f63bcd79409eb0541a4a40',
            'fields': {
                'alt-tag': 'Image'
            },
            'meta': {
                'node': '53f4e3d90126074f95d22285',
                'type': '53f5295551c4e08f29bf096b',
                'labelfield': 'alt-tag',
                'typelabel': 'Image'
            },
            '__v': 0
        },
        expectedHome = {
            '_id': '53f63bea79409eb0541a4a41',
            'fields': {
                // '53f63bcd79409eb0541a4a40' before hydration
                'ref': expectedImage.fields,
                'title': 'Home example'
            },
            'meta': {
                'node': '53f4e3d90126074f95d22285',
                'type': '53f4e58e0126074f95d22288',
                'labelfield': 'title',
                'typelabel': 'Page Home'
            },
            '__v': 0
        },
        expectedNested = {
            "title": "Deep Nest",
            "refs": [
                {
                    "refs": [],
                    "title": "Nested 1"
                },
                {
                    "title": "Nested 2",
                    "refs": [
                        {
                            "refs": [],
                            "title": "Nested 3"
                        }
                    ]
                }
            ]
        };

    before(function (done) {
        grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' })
            .then(function (token) {
                adminToken = token;
                grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' })
                    .then(function (token) {
                        readerToken = token;
                        done();
                    },
                    function (err) {
                        console.log(err);
                    });
            });
    });

    describe('getFullById', function() {
        xit('simple: should return an object with content references filled in', function (done) {
            grasshopper
                .request(adminToken)
                .content.getFullById('53f63bea79409eb0541a4a41')
                .then(function (payload) {
                    payload.fields.should.deep.equal(expectedHome.fields);
                    done(); })
                .fail(done)
                .catch(done)
                .done();
        });

        it('nested: should return an object with content references filled in', function (done) {
            grasshopper
                .request(adminToken)
                .content.getFullById('53f6f5537cec50a2b14728e0')
                .then(function (payload) {
                    payload.fields.should.deep.equal(expectedNested);
                    done(); })
                .fail(done)
                .catch(done)
                .done();
        });
    });
});
