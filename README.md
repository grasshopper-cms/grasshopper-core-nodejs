![Grasshopper Logo](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-core.jpg)

---------------------------------------------------------------

### ALPHA - TO BE RELEASED OFFICIALLY EARLY 2014

[![Build Status](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs.png?branch=master)](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs)


### What am I?

------------------------------------------------------------------

Grasshopper is a Data Management System (DMS). A DMS is a layer that sits on top of a database that makes working with the data easier for both administrators and developers.

Consolidating data management is very important if you are developing a lot of applications. This grasshopper project is a NodeJS library that can be imported by any NodeJS application.

Common CMS products do not cut it for real apps. When you push a CMS beyond it's intended use you are constantly at war with it.  Our DMS is different, it is simply a data management tool not a website creator. This distinction makes it very appealing when creating APIs, apps or non-traditional websites.




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


###  API Docs


#### Content Types

##### Valid Field Definition

TBD - Need to provide rules related to content types.


### Running Tests

-------------------------------------------------------

There are a couple of ways to run our unit tests.

* $: ```make test```
* $: ```npm test```
* $: ```grunt test```

### Upcoming Features

-------------------------------------------------------

* Hooks are not yet supported
* Full node permissions for search criteria
* Cascading permissions for child nodes
* Deleting content when deleting a content type
* Deleting content when deleting a node
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