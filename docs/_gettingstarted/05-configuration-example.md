---
title: Configuration Examples
uuid: projectconfiguration-example
language: asciidoc
---

Definitions for all possible config values

* server (optional)
    * *https*: If you need to run the API over https then you should include the server configuration
        * *key*: Absolute path to SSL private key
        * *cert* Absolute path to SSL certificate
    * *proxy*: Defaults to false.  Boolean indicating whether you are going to proxy the api onto another express server. If False, when you initialize API, it will create a server for you.
    * *maxFilesSize*: Defaults to 2 megabytes.  The Maximum file size you are allowed to upload. In bytes.
    * *maxFieldsSize*: Defaults to 2 megabytes.  The maximum field size you are allowed to have. In bytes.
    * *maxFields*: Defaults to 1000. The maximum number of fields you are allowed to have.
* crypto (required)
    * *secret_passphrase*: Unique key that will be used when encrypting/decrypting values using the utils/crypto module.

* db (required)
    * *type*: Always should be 'mongodb' until more database storage engines are supported.
    * *host*: Full URL of your mongo database connection

        [FORMAT](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#basic-parts-of-the-url)

        mongodb://[username:password@]host[:port]/[database][?options]

    * *shorthost*: Identifies either a hostname, IP address, or unix domain socket
    * *database*: Name of the database to login to
    * *username*: (optional) If given, it will attempt to login after connecting to a database server
    * *password*: (optional) If given, it will attempt to login after connecting to a database server
    * *defaultPageSize*: The number of results to be included in a "page." This value can be customized per your application
    * *debug*: (true/false) Debug mode of "true" will turn on db logging

* assets (at least 1 engine is required)
    * *default*: local/amazon
    * *tmpdir*: Absolute path on your local system where temporary files will be saved
    * *engines*: One or more ways to store assets that are posted to Grasshopper
        * *local*: Engine needed if you plan on storing files locally on your server
            * *path*: Absolute path to the "publically" browsable asset folder
            * *urlbase*: The base URL that will be serving the files (ex: http://yoursite.com/assets)
        * *[amazon](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)*: If you are going to use Amazon's S3 to store your files then you will need to define the amazon engine.
            * *accessKeyId*:  Your AWS access key ID
            * *secretAccessKey*: Your AWS secret access key
            * *[region](http://docs.aws.amazon.com/general/latest/gr/rande.html#ec2_region)*: The region to send service requests to
            * *bucket*: Buckets partition the namespace of objects stored in Amazon S3 at the top level
            * *urlbase*: The base URL that will be serving the files (could be your own or amazon's)
            * *assetsDir*: A prefix (folder) to add to your s3 keys. The keys are the node id combined with the file name.
            * *archiveDeletionsTo*: A folder to move items to instead of deleting them. Impacts individual asset deletions and node deletions. If falsey, then items will really be deleted instead of just moved.
    * IMPORTANT : Each defined engine will run (saving, updating, etc), but the engine set to default will serve the files.

* identities (optional)
    * *[google](https://developers.google.com/accounts/docs/OAuth2)* Google Oath integration
        * *[appId](https://support.google.com/a/answer/162105?hl=en)*: The client ID is considered public information, and is used to build login URLs, or included in Javascript source code on a page.
        * *[secret](https://support.google.com/a/answer/162105?hl=en)*: The client secret must be kept confidential. If a deployed app cannot keep the secret confidential, such as Javascript or native apps, then the secret is not used.
        * *redirectUrl*: The service will only redirect users to a registered URI, which helps prevent some attacks. Any HTTP redirect URIs must be protected with TLS security, so the service will only redirect to URIs beginning with "https". This prevents tokens from being intercepted during the authorization process.
        * *[scopes](https://developers.google.com/+/api/oauth#scopes)*: Scopes are strings that enable access to particular resources, such as user data. (https://www.googleapis.com/auth/userinfo.profile', https://www.googleapis.com/auth/userinfo.email)
        * *tokenEndpoint*: Location that will generate an access token in the Google system
        * *oauthCallback*: If the user grants the permission, the Google Authorization Server sends your application an access token (or an authorization code that your application can use to obtain an access token). If the user does not grant the permission, the server returns an error

* bodyParser (optional)
    * `bodyParser.limit` is passed directly to the [body-parser express middleware](https://github.com/expressjs/body-parser)
    * the default value is, `2mb`