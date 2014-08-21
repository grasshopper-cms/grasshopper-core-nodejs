module.exports = function(ObjectId) {
    'use strict';

    var ids = require('./ids');
    return [
        {
            _id: ObjectId(ids[0]),
            meta: {
                type: ObjectId('524362aa56c02c0703000001'),
                node : ObjectId(ids[0]),
                labelfield: 'testfield'
            },
            fields: {
                testfield: 'testvalue'
            }
        },
        {
            _id: ObjectId(ids[1]),
            meta: {
                type: ObjectId('524362aa56c02c0703000001'),
                node: ObjectId('526d5179966a883540000006'),
                labelfield: 'testfield'
            },
            fields: {
                testfield: 'testvalue'
            }
        },
        {
            _id: ObjectId(ids[2]),
            meta: {
                type: ObjectId('524362aa56c02c0703000123'),
                node: ObjectId('526d5179966a883540000006'),
                labelfield: 'testfield'
            },
            fields: {
                testfield: 'customtestvalue',
                testeroni: true
            }
        },
        {
            _id: ObjectId('526d5179966a883540000101'),
            meta: {
                type: ObjectId('524362aa56c02c0703000123'),
                node: ObjectId('526d5179966a883540000006'),
                labelfield: 'testfield'
            },
            fields: {
                testfield: 'testvalue12345',
                othertestfield: 'customtestvalue',
                testeroni: true
            }
        },
        {
            "_id": ObjectId("53f63bcd79409eb0541a4a40"),
            "fields": {
                "alt-tag": "Image"
            },
            "meta": {
                "node": ObjectId("53f4e3d90126074f95d22285"),
                "type": ObjectId("53f5295551c4e08f29bf096b"),
                "labelfield": "alt-tag",
                "typelabel": "Image"
            },
            "__v": 0
        },
        {
            "_id": ObjectId("53f63bea79409eb0541a4a41"),
            "fields": {
                "ref": "53f63bcd79409eb0541a4a40",
                "title": "Home example"
            },
            "meta": {
                "node": ObjectId("53f4e3d90126074f95d22285"),
                "type": ObjectId("53f4e58e0126074f95d22288"),
                "labelfield": "title",
                "typelabel": "Page Home"
            },
            "__v": 0
        }
    ];
};