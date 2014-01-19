module.exports = function(ObjectID) {
    return [
        { _id: ObjectID("5261781556c02c072a000007"), label: "Sample Node",  parent: null },
        { _id: ObjectID("526d5179966a883540000006"), label: "Locked Down Node", parent: null },
        { _id: ObjectID("526417710658fc1f0a00000b"), label: "Sample  Sub-Node", parent: ObjectID("5261781556c02c072a000007"), ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("5246e73d56c02c0744000001"), label: "Sample  Sub-Node 2", parent: ObjectID("5261781556c02c072a000007"), ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("5246e80c56c02c0744000002"), label: "Sample  Sub-Node 3", parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("52619b3dabc0ca310d000003"), label: "Sample  Sub-Node 4",  parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("5261777656c02c072a000001"), label: "Sample  Sub-Node 5",  parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("5261b811a94c1a971f000003"), label: "Sample  Sub-Node 6",  parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("5245ce1d56c02c066b000001"), label: "Sample  Sub-Node 7",  parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("524362aa56c02c0703000001"), label: "Sample  Sub-Node 8", parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("5254908d56c02c076e000001"), label: "Sample  Sub-Node 9",  parent: ObjectID("5261781556c02c072a000007"),ancestors: [ObjectID("5261781556c02c072a000007")] },
        { _id: ObjectID("52712a3e2eacd5a714000002"), label: "Sample Sub Sub-Node 1",  parent: ObjectID("5254908d56c02c076e000001"),ancestors: [ObjectID("5261781556c02c072a000007"), ObjectID("5254908d56c02c076e000001")] },
        { _id: ObjectID("52712a3e2eacd5a714000001"), label: "Sample Sub Sub-Node 2",  parent: ObjectID("524362aa56c02c0703000001"),ancestors: [ObjectID("5261781556c02c072a000007"), ObjectID("5254908d56c02c076e000001")] },
        { _id: ObjectID("52712a3e2eacd5a714000006"), label: "Sample Sub Sub-Node 3",  parent: ObjectID("524362aa56c02c0703000001"),ancestors: [ObjectID("5261781556c02c072a000007"), ObjectID("5254908d56c02c076e000001")] }
    ];
};