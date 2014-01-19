module.exports = function(ObjectID) {
    return [
        { _id: ObjectID("524362aa56c02c0703000001"), label: "This is my test content type", helpText: "", meta: [], description: "", fields: [{id: "testfield", required: true, instancing: 1, type: "textbox", label: "Title" } ]},
        {
            _id: ObjectID("5254908d56c02c076e000001"),
            label: "Users",
            description: "Protected content type that defines users in the system.",
            helpText: "These fields are the minimum required to create a user in the system. See more about extending users through plugins.",
            fields: {
                login: {
                    label: "Login",
                    type: "textbox",
                    required: true,
                    instancing: 1
                },
                name: {
                    label: "Name",
                    type: "textbox",
                    required: true,
                    instancing: 1
                },
                email: {
                    label: "Email",
                    type: "textbox",
                    required: true,
                    instancing: 1
                },
                role: {
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
                password: {
                    label: "Email",
                    type: "password",
                    required: true,
                    instancing: 1
                },
                enabled: {
                    label: "Enabled",
                    type: "checkbox",
                    required: true,
                    instancing: 1
                }
            },
            meta: [],
            protected: true
        }

    ];
};