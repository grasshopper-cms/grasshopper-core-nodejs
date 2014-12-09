---
title: Project Configuration
uuid: projectconfiguration
---

#### Configuring your project


When you run the `grasshopper fly` command, you get a fully functional application, but you may want to change some of the configuration values.
The configuration values are passed into `grasshopper-api`.


##### Api / Core

Start grasshopper api is done by requiring it in and passing in an options object. A convenient way to do this is to create
a JSON config file and use it as the options object as follows:

```javascript
var ghapi = require('grasshopper-api'),
    options = require('./grasshopper-config.json'),
    ghcore,
    ghapiRouter,
    returnedObject;

returnedObject = ghapi(options);

// the router should be used in conjunction with express
// it can be added directly to the app or piggy backed on another router
// e.g. expressApp.use('/api', ghapiRouter);
ghapiRouter = returnedObject.router;

// ghcore can be used to make queries, etc.
ghcore = returnedObject.core;
```

Here is an example file:

```json
{
    "server": {
        "https":{
            "key":"{full path to key}",
            "cert":"{full path to cert}"
        },
        "proxy" : false,
        "maxFilesSize": 2000000,
        "maxFieldsSize": 2000000,
        "maxFields": 1000
    },
    "crypto": {
       "secret_passphrase" : "{unique term per project}"
    },
    "db": {
       "type": "mongodb",
       "host": "mongodb://localhost/{database name}",
       "shorthost":"localhost",
       "database": "{database name}",
       "username": "",
       "password": "",
       "defaultPageSize" : "10000",
       "debug": false
    },
    "assets": {
       "default" : "local",
       "tmpdir" : "{absolute path to tmp directory}",
       "engines": {
            "local":{
                "path":"{absolute path to public asset folder from the root of your comp}",
                "urlbase":"{full url base to serve files from}"
            }
       }
    },
    "logger" : {
       "adapters": [{
            "type":"console",
            "application":"{application name}",
            "machine":"{machine name}"
       }]
    },
    "identities" : {
        "google" : {
            "appId" : "{ your google app id }",
            "secret" : "{ your google secret id }",
            "scopes" : [ "{ array of scopes you want to authorize }" ],
            "redirectUrl" : "{ the url you want to redirect to after successful auth, the users token will be appended to this route ex. '/login' entered here will send the user to '/login/googleToken' }"
        }
    },
    "bodyParser" : {
        "limit" : "5m"
    }
}
```
