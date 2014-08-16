---
title: User Methods
uuid: user-methods
---

##### User methods

* users.query
    * middleware.identity,
    * middleware.role(roles.ADMIN),
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.users.query,
    * middleware.event('out')

* users.insert
    * middleware.identity,
    * middleware.role(roles.ADMIN),
    * middleware.users.linkedidentities.create,
    * middleware.users.parse,
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.users.validate,
    * middleware.users.insert,
    * middleware.event('out'),
    * middleware.event('save')

* users.update
    * middleware.identity,
    * setDefaultUser,
    * roleOrSelf(roles.ADMIN),
    * middleware.users.parse,
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.users.validate,
    * middleware.users.update,
    * middleware.event('out'),
    * middleware.event('save')

* users.getById
    * middleware.identity,
    * setDefaultUser,
    * roleOrSelf(roles.ADMIN),
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.users.getById,
    * middleware.event('out')

* users.getByEmail
    * middleware.identity,
    * middleware.role(roles.ADMIN),
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.users.getByEmail,
    * middleware.event('out')

* users.deleteById
    * middleware.identity,
    * middleware.role(roles.ADMIN),
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.users.deleteById,
    * middleware.event('out'),
    * middleware.event('delete')

* users.savePermissions
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.identity,
    * middleware.role(roles.ADMIN)

* users.deletePermissions
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.identity,
    * middleware.role(roles.ADMIN)

* users.linkIdentity
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.identity,
    * middleware.users.linkIdentity,
    * middleware.event('out'),
    * middleware.event('save')

* users.unlinkIdentity
    * middleware.event('parse'),
    * middleware.event('validate'),
    * middleware.identity,
    * middleware.users.unLinkIdentity,
    * middleware.event('out'),
    * middleware.event('save')