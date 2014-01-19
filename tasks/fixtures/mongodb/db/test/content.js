module.exports = function(ObjectID) {
    var ids = require('./ids');
    return [
        {
            _id: ObjectID(ids[0]),label:"Sample content title", slug: 'sample_content_title', type: ObjectID("524362aa56c02c0703000001"), nonce:"1234565", status: "Live", node : {_id: ObjectID(ids[0]), displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: ObjectID("5246e73d56c02c0744000001"), name: "Test User"}
        },{
            _id: ObjectID(ids[1]),label:"Sample content title", slug: 'sample_confdstent_title', type: ObjectID("524362aa56c02c0703000001"), nonce:"1234fds565", status: "Live", node : {_id: ObjectID("526d5179966a883540000006"), displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: ObjectID("5246e73d56c02c0744000001"), name: "Test User"}
        }
    ];
}