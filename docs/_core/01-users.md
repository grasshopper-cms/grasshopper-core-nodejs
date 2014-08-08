---
title: Users
uuid: core-users
---
#### Users

User Properties

```javascript
{
    _id: 12345657, // Valid Mongo Object Id
    role: 'admin', // The users role, see below for more information on roles.
    enabled: true, // Boolean indicating if the user is currently enabled or not.
    firstname: 'firstname', // The users First Name.
    lastname: 'lastname', // The users Last Name.
    identities: {  // The Identities object represents the identities that the user has, this is private and will never be returned.
        basic: { // The basic identity represents the most simple form of auth.
            username: 'admin', // The Users username that they would use to login.
            salt: '111111111',  // Salt for password.
            hash: '282828282828282828' // Hash for password.
        }
    },
    displayName : 'admin', // The users display name, if not set when creating a user, it will default to the login for basic auth, and the email address for google auth.
    linkedIdentities : ['basic'], // Array representing the identities the user has.
    email: 'apitestuser@thinksolid.com', // The users email address.
    profile : {} // The users profile, This can be an object containing anything.
}
```

Roles (in order of power) :
    1. Admin - Can do anything.
    1. Editor - Can create and edit content and content types.
    1. Author - Can only create content.
    1. Reader - Can only read content.
    1. External - Cannot access the admin in any way.


User methods

* users.query
    middleware.identity,
            middleware.role(roles.ADMIN),
            middleware.event('parse'),
            middleware.event('validate'),
            middleware.users.query,
            middleware.event('out')

* users.insert
    middleware.identity,
            middleware.role(roles.ADMIN),
            middleware.users.linkedIdentities.create,
            middleware.users.parse,
            middleware.event('parse'),
            middleware.event('validate'),
            middleware.users.validate,
            middleware.users.insert,
            middleware.event('out'),
            middleware.event('save')

* users.update
    middleware.identity,
            setDefaultUser,
            roleOrSelf(roles.ADMIN),
            middleware.users.parse,
            middleware.event('parse'),
            middleware.event('validate'),
            middleware.users.validate,
            middleware.users.update,
            middleware.event('out'),
            middleware.event('save')

* users.getById
    middleware.identity,
            setDefaultUser,
            roleOrSelf(roles.ADMIN),
            middleware.event('parse'),
            middleware.event('validate'),
            middleware.users.getById,
            middleware.event('out')

* users.getByEmail
    middleware.identity,
            middleware.role(roles.ADMIN),
            middleware.event('parse'),
            middleware.event('validate'),
            middleware.users.getByEmail,
            middleware.event('out')

* users.deleteById
    middleware.identity,
            middleware.role(roles.ADMIN),
            middleware.event('parse'),
            middleware.event('validate'),
            middleware.users.deleteById,
            middleware.event('out'),
            middleware.event('delete')

* users.savePermissions
    [middleware.event('parse'), middleware.event('validate'), middleware.identity, middleware.role(roles.ADMIN)]

* users.deletePermissions
    [middleware.event('parse'), middleware.event('validate'), middleware.identity, middleware.role(roles.ADMIN)]

* users.linkIdentity
    middleware.event('parse'),
            middleware.event('validate'),
            middleware.identity,
            middleware.users.linkIdentity,
            middleware.event('out'),
            middleware.event('save')

* users.unlinkIdentity
    middleware.event('parse'),
            middleware.event('validate'),
            middleware.identity,
            middleware.users.unLinkIdentity,
            middleware.event('out'),
            middleware.event('save')