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
                            _id : 'alpha',
                            options : {
                                min : 5,
                                max : 10
                            }
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
                            _id : 'number',
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
                            _id : 'alpha_numeric',
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
                            _id : 'email'
                        }
                    ]
                },{
                    _id: 'uniquefield1',
                    type: 'textbox',
                    label: 'Globally Unique Field',
                    validation: [
                        {
                            _id : 'unique',
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
                            _id : 'unique',
                            options: {
                                property: 'fields.uniquefield2',
                                contentTypes: ['524362aa56c02c0703000001']
                            }
                        }
                    ]
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
                            _id : 'unique',
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
        }

    ];
};