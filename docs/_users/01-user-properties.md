---
title: User Properties
uuid: user-properties

---

##### User Properties

```javascript
    {
        _id: 12345657,
        role: 'admin',
        enabled: true,
        firstname: 'firstname',
        lastname: 'lastname',
        identities: {
            basic: {
                username: 'admin',
                salt: '111111111',
                hash: '282828282828282828'
            },
            google: {
                id: '292929292929292',
                accessToken: '474747474747'
                refreshToken: '4098409874'
            }
        },
        displayname : 'admin',
        linkedidentities : ['basic'],
        email: 'apitestuser@thinksolid.com',
        profile : {}
    }
```
