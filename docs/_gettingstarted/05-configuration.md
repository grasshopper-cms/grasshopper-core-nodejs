---
title: Project Configuration
uuid: projectconfiguration
---

#### Configuring your project


When you run the `grasshopper fly` command, you get a fully functional application, but you may want to change some of the configuration values.


##### Api / Core

Once you have a `ghapi.json` file in the root of your project you can change any of the values that you like.

Here is an example file:


    {
        "server": {
            "https":{
                "key":"{full path to key}",
                "cert":"{full path to cert}"
            },
            "proxy" : "{ defaults to false.  Boolean indicating whether you are going to proxy the api onto another express server. If False, when you initialize API, it will create a server for you. }",
            "maxFilesSize": "{ defaults to 2 megabytes.  The Maximum file size you are allowed to upload. In bytes. }",
            "maxFieldsSize": "{ defaults to 2 megabytes.  The maximum field size you are allowed to have. In bytes. }",
            "maxFields": "{ defaults to 1000. The maximum number of fields you are allowed to have. }"
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
                    "path":"{absolute path to public asset folder}",
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
        }
    }
