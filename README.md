![Grasshopper Logo](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-core.jpg)

---------------------------------------------------------------

[![NPM](https://nodei.co/npm/grasshopper-core.png)](https://nodei.co/npm/grasshopper-core/)

[![Build Status](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs.png?branch=master)](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs)


### What am I?

------------------------------------------------------------------

Grasshopper is a Data Management System (DMS). A DMS is a layer that sits on top of a database that makes working with the data easier for both administrators and developers. Grasshopper knows about data, schemas, data organization and permissions/roles. Since these concepts are core to grasshopper you will not have to figure them out for each of your applications.

Standardizing data management is very important if you are developing a lot of applications. The grasshopper project is a NodeJS library that can be used as part of your solution.

The most common implementation of grasshopper includes the admin project (dynamic UI that manages grasshopper data) and grasshopper-api (HTTP wrapper for core). If you are building a NodeJS project then grasshopper-core could be used natively in your application as well.


[GRASSHOPPER API](https://github.com/Solid-Interactive/grasshopper-api-js)

[GRASSHOPPER ADMIN](https://github.com/Solid-Interactive/grasshopper-admin)



### Core concepts

------------------------------------------------------------------

*Users* - most applications need the concept of users, grasshopper provides a standard way to create and extend user data. It also supports roles and node based permissions.

*Content Types* - or virtual schemas, since you are most likely using a NoSQL database you are not bound to any specific schema. Most applications still require data to be predictable so grasshopper allows the developer to create virtual schemas to accomplish data consistency.

*Nodes* - or directories, nodes can be created to organize content into buckets of your choosing.

*Content* - or an implementation of a content type. Many types of content make up an application.


### How would you use me?

------------------------------------------------------------------

Install
```
npm install grasshopper-core
```

Usage



### Configuration Options

------------------------------------------------------------------

Below is an example configuration file. You should edit the parameters below to suit your needs.

Open the ```lib/config/configuration``` file

        {
            "cache": {
                "path": "./cache"
            },
            "crypto": {
                "secret_passphrase" : "{Create guid}"
            },
            "db": {
                "type": "mongodb",
                "host": "mongodb://localhost:27017/{your info here}",
                "database": "{your info here}",
                "username": "{your info here}",
                "password": "{your info here}",
                "debug": false
            },
            "assets": {
                "default" : "amazon",
                "tmpdir" : "{absolute path to your tmp folder}",
                "engines": {
                    "amazon" : {
                        "accessKeyId": "{your info here}",
                        "secretAccessKey": "{your info here}",
                        "region" : "us-east-1",
                        "bucket" : "{your info here}",
                        "urlbase" : "{your info here}"
                    },
                    "local" : {
                        "path" : "{absolute path to your local assets}",
                        "urlbase" : "{fully qualified url base to your assets}"
                    }
                }
            },
            "logger" : {
                "adapters": [{
                    "type": "file",
                    "path": "{absolute path to your log file}",
                    "application": "{name your application}",
                    "machine": "{name your machine}"
                }]
            }
        }



#### Configuration Definitions

------------------------------------------------------------------

* cache: Set path the cached files/data are going to live. (Default is cache directoy in root of project).
* crypto: Set a unique secret_passphrase that can be used to encrypt data.
* DB settings
    * type: mongodb (right now only backend supported)
    * host: URL to database
    * database: Name of the database
    * username: User name of the database
    * password: password for the database
    * degug: bool (do you want output into the console)
* logger: Module used to capture logs from the API/SDK
    * type: file
    * path: Location that the file will be saved to
    * application: Name of your application
    * machine: Identifyable name of your server
* assets: Where are your file attachments going to get stored
    * default: which provider are you going to use (local or amazon)
    * tmpdir: temp file directory
    * engines: collections of engines that will be used. NOTE: all engines get files saved to them, only the default returns results



### Running Tests

-------------------------------------------------------

There are a couple of ways to run our unit tests.

* $: ```grunt test```

### Upcoming Features

-------------------------------------------------------

* Node based permissions
* Hooks are not yet supported
* Full node permissions for search criteria
* Cascading permissions for child nodes
* Deleting content when deleting a content type
* Registering new collections
* Security enhancements
* Publish content to other environments
* Content localization
* Content history
* Document merges
* Dynamic content model validation
* Plug in custom roles for advanced proxy implementations
* Document concurrency protection
* 3rd party authentication schemes
* more more more


## License

-------------------------------------------------------

Grasshopper API JS is released under a [MIT license](https://github.com/Solid-Interactive/grasshopper-core-nodejs/blob/master/LICENSE).