(function(){
    "use strict";

    var data = {},
        ObjectID = require('mongodb').ObjectID;

    data.hookEvents = [
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
    ]

    data.users = [
        { _id: ObjectID("5246e73d56c02c0744000004"), role: "admin",enabled: true, firstname: "Test", lastname: "User", login: "admin", salt: "225384010328", pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "admin@thinksolid.com" }
    ];

    data.nodes = [
        { _id: ObjectID("5261781556c02c072a000007"), label: "Help", parent: null },
        { _id: ObjectID("526d5179966a883540000006"), label: "Lessons", parent: null },
        { _id: ObjectID("526417710658fc1f0a00000b"), label: "What is grasshopper?", parent: ObjectID("526d5179966a883540000006"), ancestors: [ObjectID("526d5179966a883540000006")] },
        { _id: ObjectID("5246e73d56c02c0744000001"), label: "Working with the API", parent: ObjectID("526d5179966a883540000006"), ancestors: [ObjectID("526d5179966a883540000006")] },
        { _id: ObjectID("5246e80c56c02c0744000002"), label: "Building applications", parent: ObjectID("526d5179966a883540000006"),ancestors: [ObjectID("526d5179966a883540000006")] },
        { _id: ObjectID("52619b3dabc0ca310d000003"), label: "Blog",  parent: null },
        { _id: ObjectID("5261777656c02c072a000001"), label: "Static Content",  parent: null },
        { _id: ObjectID("5261b811a94c1a971f000003"), label: "Support", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001")] },
        { _id: ObjectID("5245ce1d56c02c066b000001"), label: "Legal", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001")] },
        { _id: ObjectID("524362aa56c02c0703000001"), label: "Admin", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] },
        { _id: ObjectID("5254908d56c02c076e000001"), label: "User", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] },
        { _id: ObjectID("52712a3e2eacd5a714000002"), label: "Developer",  parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] },
        { _id: ObjectID("52cc627f69c89d8b1a000001"), allowedTypes: [ ObjectID("52cc57c556c02c14b1000001") ], ancestors: [], label: "Films", parent: null },
        { _id: ObjectID("52cc62b369c89d8b1a000002"), allowedTypes: [ ObjectID("524362aa56c02c0703000001") ], ancestors: [], label: "Static Content", parent: null }
    ];

    data.contentTypes = [
        {
            _id: ObjectID("524362aa56c02c0703000001"),
            label: "This is my test content type",
            helpText: "",
            meta: [],
            description: "",
            fields: [
                {
                    id: "testfield",
                    required: true,
                    instancing: 1,
                    type: "textbox",
                    label: "Title"
                }
            ]
        },
        {
            _id: ObjectID("5254908d56c02c076e000001"),
            label: "Users",
            description: "Protected content type that defines users in the system.",
            helpText: "These fields are the minimum required to create a user in the system. See more about extending users through plugins.",
            fields: [
                {
                    label: "Login",
                    type: "textbox",
                    required: true,
                    instancing: 1
                },
                {
                    label: "Name",
                    type: "textbox",
                    required: true,
                    instancing: 1
                },
                {
                    label: "Email",
                    type: "textbox",
                    required: true,
                    instancing: 1
                },
                {
                    label: "Role",
                    type: "dropdown",
                    required: true,
                    options: {
                        items: [
                            { id: "reader", val: "Reader" },
                            { id: "author", val: "Author" },
                            { id: "editor", val: "Editor" },
                            { id: "admin", val: "Admin" },
                            { id: "none", val: "None" }
                        ]
                    },
                    instancing: 1
                },
                {
                    label: "Email",
                    type: "password",
                    required: true,
                    instancing: 1
                },
                {
                    label: "Enabled",
                    type: "checkbox",
                    required: true,
                    instancing: 1
                }
            ],
            meta: [],
            protected: true
        },
        {
            label: "Film",
            fields: [
                {
                    type: "textbox",
                    required: true,
                    label: "Title",
                    _id: "title"
                },
                {
                    type: "textarea",
                    required: false,
                    label: "Short Summary",
                    _id: "shortsummary"
                },
                {
                    type: "textarea",
                    required: false,
                    label: "Full Summary",
                    _id: "fullsummary"
                },
                {
                    multi: true,
                    options: [
                        {
                            kids: "Kids"
                        },
                        {
                            indie: "Inide"
                        },
                        {
                            explosions: "Stuff With Explosions"
                        }
                    ],
                    type: "dropdown",
                    label: "Categories",
                    _id: "categories"
                },
                {
                    type: "readonly",
                    required: false,
                    label: "Partner ID",
                    _id: "partnerid"
                },
                {
                    multi: true,
                    type: "textbox",
                    label: "Badges",
                    _id: "badges"
                },
                {
                    multi: true,
                    type: "textbox",
                    label: "Genres",
                    _id: "genres"
                },
                {
                    multi: true,
                    type: "textbox",
                    label: "Tags",
                    _id: "tags"
                },
                {
                    type: "readonly",
                    label: "Region",
                    _id: "region"
                },
                {
                    type: "readonly",
                    label: "Work Type",
                    _id: "worktype"
                },
                {
                    type: "readonly",
                    label: "Release Year",
                    _id: "releaseyear"
                },
                {
                    type: "readonly",
                    label: "Run Length",
                    _id: "runlength"
                },
                {
                    type: "ref",
                    label: "Ratings",
                    ref: ObjectID("52cc5d2756c02c14b1000002"),
                    _id: "ratings"
                },
                {
                    type: "readonly",
                    label: "Country of Origin",
                    _id: "countryoforigin"
                },
                {
                    multi: true,
                    type: "readonly",
                    label: "Actors",
                    _id: "actors"
                },
                {
                    multi: true,
                    type: "readonly",
                    label: "Directors",
                    _id: "directors"
                },
                {
                    multi: true,
                    type: "readonly",
                    label: "Producers",
                    _id: "producers"
                },
                {
                    type: "readonly",
                    label: "Studio",
                    _id: "studio"
                },
                {
                    type: "ref",
                    label: "Availability",
                    ref: ObjectID("52cc5eb856c02c14b1000003"),
                    _id: "availability"
                },
                {
                    type: "ref",
                    label: "Trailers",
                    ref: ObjectID("52cc602156c02c14b1000004"),
                    _id: "trailers"
                },
                {
                    type: "ref",
                    label: "Digital Assets",
                    ref: ObjectID("52cc602156c02c14b1000004"),
                    _id: "digitalassets"
                },
                {
                    type: "ref",
                    label: "Images",
                    ref: ObjectID("52cc621956c02c14b1000005"),
                    _id: "images"
                }
            ],
            _id: ObjectID("52cc57c556c02c14b1000001"),
            description: "",
            helpText: ""
        },
        {
            label: "Ratings",
            _id: ObjectID("52cc5d2756c02c14b1000002"),
            fields: [
                {
                    type: "textbox",
                    _id: "title",
                    label: "Title"
                },
                {
                    type: "textbox",
                    _id: "region",
                    label: "Region"
                },
                {
                    type: "textbox",
                    _id: "system",
                    label: "System"
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        },
        {
            label: "Availability",
            _id: ObjectID("52cc5eb856c02c14b1000003"),
            fields: [
                {
                    type: "readonly",
                    _id: "licensetype",
                    label: "License Type"
                },
                {
                    type: "readonly",
                    _id: "start",
                    label: "Start"
                },
                {
                    type: "readonly",
                    _id: "end",
                    label: "End"
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        },
        {
            label: "Digital Assets",
            _id: ObjectID("52cc602156c02c14b1000004"),
            fields: [
                {
                    type: "readonly",
                    _id: "assetid",
                    label: "Asset ID"
                },
                {
                    type: "readonly",
                    _id: "url",
                    label: "URL"
                },
                {
                    type: "readonly",
                    _id: "height",
                    label: "Height"
                },
                {
                    type: "readonly",
                    _id: "width",
                    label: "Width"
                },
                {
                    type: "readonly",
                    _id: "aspectratio",
                    label: "Aspect Ratio"
                },
                {
                    type: "readonly",
                    _id: "drmtype",
                    label: "DRM Type"
                },
                {
                    type: "readonly",
                    _id: "audioprofile",
                    label: "Audio Profile"
                },
                {
                    type: "readonly",
                    _id: "encodingprofile",
                    label: "Encoding Profile"
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        },
        {
            label: "Image Assets",
            _id: ObjectID("52cc621956c02c14b1000005"),
            fields: [
                {
                    type: "readonly",
                    _id: "url",
                    label: "URL"
                },
                {
                    type: "readonly",
                    _id: "size",
                    label: "Size"
                },
                {
                    type: "readonly",
                    _id: "height",
                    label: "Height"
                },
                {
                    type: "readonly",
                    _id: "width",
                    label: "Width"
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        }

    ];

    data.content = [
        {
            _id: ObjectID("5261781556c02c072a000007"),
            label:"Sample content title",
            slug: 'sample_content_title',
            type: ObjectID("524362aa56c02c0703000001"),
            nonce:"1234565",
            status: "Live",
            node : {
                _id: ObjectID("5261781556c02c072a000007"),
                displayOrder: 1
            },
            fields: {
                testfield: "test value"
            },
            author: {
                _id: ObjectID("5246e73d56c02c0744000001"),
                name: "Test User"
            }
        },{
            _id: ObjectID("5254908d56c02c076e000001"),
            label:"Sample content title",
            slug: 'sample_confdstent_title',
            type: ObjectID("524362aa56c02c0703000001"),
            nonce:"1234fds565",
            status: "Live",
            node : {
                _id: ObjectID("5261781556c02c072a000007"),
                displayOrder: 1
            },
            fields: {
                testfield: "test value"
            },
            author: {
                _id: ObjectID("5246e73d56c02c0744000001"),
                name: "Test User"
            }
        },
        {
            _id: ObjectID("52cf349456c02c0722000001"),
            node: {
                displayOrder: 1,
                _id: ObjectID("52cc627f69c89d8b1a000001")
            },
            author: {
                name: "Test User",
                _id: ObjectID("5246e73d56c02c0744000001")
            },
            type: ObjectID("52cc57c556c02c14b1000001"),
            status: "Live",
            label: "Dune by Frank Herbet",
            nonce: "1234fdsdfsa565",
            slug: "generated_title",
            fields: {
                badges: [
                    "test badges",
                    "test badges"
                ],
                digitalassets: "test digitalassets",
                fullsummary: "text fullsummary",
                runlength: "test runlength",
                studio: "test studio",
                actors: [
                    "test actors",
                    "test actors"
                ],
                producers: "test producers",
                images: "images",
                trailers: "test trailers",
                genres: "test genres",
                directors: "test directors",
                partnerid: "test partnerid",
                availability: "test availability",
                worktype: "test worktype",
                releaseyear: "test releaseyear",
                ratings: "ratings",
                categories: [
                    "kids",
                    "indie"
                ],
                shortsummary: "test shortsummary",
                tags: "test tags",
                countryoforigin: "test countryoforigin",
                title: "test title",
                region: "test region"
            }
        }
    ];

    module.exports = data;
})();

