module.exports = function(ObjectID) {
    return [
        { _id: ObjectID("5261781556c02c072a000007"), name: "ContentCreated", description: "Hook gets fired after a piece of content gets created." },
        { _id: ObjectID("526d5179966a883540000006"), name: "ContentDeleted", description: "Hook gets fired after a piece of content gets deleted." },
        { _id: ObjectID("526417710658fc1f0a00000b"), name: "ContentUpdated", description: "Hook gets fired after a piece of content gets updated." },
        { _id: ObjectID("5246e73d56c02c0744000001"), name: "NodeCreated", description: "Hook gets fired after a node gets created." },
        { _id: ObjectID("5246e80c56c02c0744000002"), name: "NodeDeleted", description: "Hook gets fired after a node gets deleted." },
        { _id: ObjectID("52619b3dabc0ca310d000003"), name: "NodeUpdated", description: "Hook gets fired after a node gets updated." },
        { _id: ObjectID("5261777656c02c072a000001"), name: "BeforeAuthentication", description: "Hook gets fired before a user gets authenticated in the system." },
        { _id: ObjectID("52712a3e2eacd5a714000002"), name: "AfterAuthentication", description: "Hook gets fired after a user gets authenticated." },
        { _id: ObjectID("52712a3e2eacd5a714000001"), name: "RetrieveIdentity", description: "Hook for working around the default user authentication. A 3rd party system could be added as a proxy to verify the identities of users." },
        { _id: ObjectID("52712a3e2eacd5a714000006"), name: "ContentLoaded", description: "Hook gets fired when a piece of content gets loaded." }
    ];
}