module.exports = function(ObjectID) {
    'use strict';

    var ids = require('./ids');
    return [
        {
            _id: ObjectID(ids[0]),
            meta: {
                type: ObjectID('524362aa56c02c0703000001'),
                node : ObjectID(ids[0]),
                labelfield: 'testfield'
            },
            fields: {
                testfield: 'testvalue'
            }
        },{
            _id: ObjectID(ids[1]),
            meta: {
                type: ObjectID('524362aa56c02c0703000001'),
                node: ObjectID('526d5179966a883540000006'),
                labelfield: 'testfield'
            },
            fields: {
                testfield: 'testvalue'
            }
        }
    ];
};