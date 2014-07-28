module.exports = function(ObjectID) {
    'use strict';

    return [
        {
            _id: ObjectID('524362aa56c02c0703000001'),
            label: 'This is my test content type',
            helpText: '',
            description: '',
            fields: [
                {
                    _id: 'testfield',
                    required: true,
                    instancing: 1,
                    type: 'textbox',
                    label: 'Title',
                    validation: [
                        {
                            type : 'alpha',
                            options : {
                                min : 5,
                                max : 10
                            }
                        }
                    ]
                },
                {
                    _id: 'coopersfield',
                    required: true,
                    instancing: 1,
                    type: 'textbox',
                    label: 'CoopersField',
                    validation: [
                        {
                            type : 'number'
                        }
                    ]
                },
                {
                    _id: 'numfield',
                    required: false,
                    instancing: 1,
                    type: 'textbox',
                    label: 'Num Field',
                    validation: [
                        {
                            type : 'number',
                            options : {
                                min : 5,
                                max : 10
                            }
                        }
                    ]
                },
                {
                    _id: 'alphanumfield',
                    required: false,
                    instancing: 1,
                    type: 'textbox',
                    label: 'AlphaNum Field',
                    validation: [
                        {
                            type : 'alpha_numeric',
                            options : {
                                min : 5,
                                max : 10
                            }
                        }
                    ]
                },
                {
                    _id: 'emailfield',
                    type: 'textbox',
                    label: 'Email Field',
                    validation: [
                        {
                            type : 'email'
                        }
                    ]
                },{
                    _id: 'uniquefield1',
                    type: 'textbox',
                    label: 'Globally Unique Field',
                    validation: [
                        {
                            type : 'unique',
                            options: {
                                property: 'fields.uniquefield1'
                            }
                        }
                    ]
                },{
                    _id: 'uniquefield2',
                    type: 'textbox',
                    label: 'Unique Field For Specific Content Type',
                    validation: [
                        {
                            type : 'unique',
                            options: {
                                property: 'fields.uniquefield2',
                                contentTypes: ['524362aa56c02c0703000001']
                            }
                        }
                    ]
                },{
                    _id: 'booleanfield',
                    required: false,
                    label: 'BooleanField',
                    type: 'checkbox'
                },
                {
                    _id: 'stringnumfield',
                    required: false,
                    type: 'textbox',
                    label: 'String Num Field'
                }
            ]
        },
        {
            label: "This is another test content",
            _id: ObjectID("524362aa56c02c0703000123"),
            helpText: "",
            meta: [],
            description: "",
            fields: [
                {
                    _id: "testfield",
                    required: true,
                    min : 1,
                    max : 1,
                    type: "textbox",
                    label: "Title"
                },
                {
                    _id: "testeroni",
                    required: true,
                    min : 1,
                    max : 1,
                    type: "textbox",
                    label: "Title"
                }
            ]
        },
        {
            _id: ObjectID('5254908d56c02c076e000001'),
            label: 'Users',
            description: 'Protected content type that defines users in the system.',
            helpText: 'These fields are the minimum required to create a user in the system. See more about extending users through plugins.',
            fields: [
                {
                    _id: 'login',
                    label: 'Login',
                    type: 'textbox',
                    validation: [
                        {
                            type : 'unique',
                            options: {
                                property: 'login',
                                contentTypes: ['5254908d56c02c076e000001']
                            }
                        }
                    ]
                },
                {
                    _id: 'name',
                    label: 'Name',
                    type: 'textbox'
                },
                {
                    _id: 'email',
                    label: 'Email',
                    type: 'textbox'
                },
                {
                    _id: 'role',
                    label: 'Role',
                    type: 'dropdown',
                    options: {
                        items: [
                            { id: 'reader', val: 'Reader' },
                            { id: 'author', val: 'Author' },
                            { id: 'editor', val: 'Editor' },
                            { id: 'admin', val: 'Admin' },
                            { id: 'none', val: 'None' }
                        ]
                    }
                },
                {
                    _id: 'password',
                    label: 'Email',
                    type: 'password'
                },{
                    _id: 'enabled',
                    label: 'Enabled',
                    type: 'checkbox'
                }
            ],
            protected: true
        },
        // Checkbox Plugin
        {
            "__v" : 1,
            "_id" : ObjectID("53d155b4ae9b9800003846e6"),
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
                    "dataType" : "boolean",
                    "_id" : "booleancheckbox",
                    "validation" : [],
                    "type" : "checkbox",
                    "options" : [
                        {
                            "label" : "I agree",
                            "_id" : "true"
                        },
                        {
                            "label" : "Has Legs?",
                            "_id" : "hasLegs"
                        },
                        {
                            "label" : "Has Face",
                            "_id" : "hasFace"
                        }
                    ],
                    "min" : 1,
                    "max" : 1,
                    "label" : "Boolean Checkbox"
                }
            ],
            "label" : "Test Checkbox"
        },
        // Boolean Plugin
        {
            "label" : "Test Boolean",
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
                    "dataType" : "boolean",
                    "_id" : "test",
                    "validation" : [],
                    "type" : "boolean",
                    "options" : false,
                    "min" : 1,
                    "max" : 1,
                    "label" : "This is a test"
                }
            ],
            "_id" : ObjectID("53d18820ae9b9800003846ed"),
            "__v" : 0
        },
        // Date Plugin
        {
            "label" : "Test Date",
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
                    "_id" : "a_date",
                    "validation" : [],
                    "type" : "date",
                    "options" : false,
                    "min" : 1,
                    "max" : 1,
                    "label" : "A Date"
                }
            ],
            "_id" : ObjectID("53d15687ae9b9800003846e7"),
            "__v" : 0
        },
        // Date-Time Plugin
        {
            "label" : "Test DateTime",
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
                    "_id" : "a_datetime",
                    "validation" : [],
                    "type" : "datetime",
                    "options" : false,
                    "min" : 1,
                    "max" : 1,
                    "label" : "A DateTime"
                }
            ],
            "_id" : ObjectID("53d156e5ae9b9800003846e8"),
            "__v" : 0
        },
        // Editorial Plugin
        {
            "label" : "Test Editorial",
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
                    "_id" : "an_editorial",
                    "validation" : [],
                    "type" : "editorialwindow",
                    "options" : false,
                    "min" : 1,
                    "max" : 1,
                    "label" : "An Editorial"
                }
            ],
            "_id" : ObjectID("53cece81e1c9ff0b00e6b4a2"),
            "__v" : 0
        },
        // Number Plugin
        {
            "label" : "Test Number",
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
                    "dataType" : "object",
                    "_id" : "shouldbenumber",
                    "validation" : [],
                    "type" : "number",
                    "options" : false,
                    "min" : 1,
                    "max" : 1,
                    "label" : "This is a number"
                }
            ],
            "_id" : ObjectID("53d19248ae9b9800003846f0"),
            "__v" : 0
        }

    ];
};