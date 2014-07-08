---
title: Getting Started
uuid: gettingstarted
---
### Getting started

You will find that many concepts that modern applications need are built right into Grasshopper. When you use the framework to the fullest extent, you are only limited by your own creativity.

The Grasshopper stack is modular and built on top of modern web developement technologies. It was written entirely in JavaScript and it uses a NoSQL database system. File storage can either be local or in the cloud on a CDN.

Grasshopper will run in any environment that supports Node.js and MongoDB. This is great news for users hosting the application themselves or using services like Heroku, Engine Yard or any other PaaS (Platform as a Service).

Every implementation of the system is different but keep reading and you will start to get a sense of how the project is organized.

#### Grasshopper Stack

![Stack](/images/stack.png)

#### Requirements

* Environment that can run [Node.js](http://nodejs.org/download/). Node.js is released under the MIT license and has installation packages available for Linux, Windows and Macintosh.
* Instance of [Grunt](http://gruntjs.com/) (JavaScript Task Runner) installed.  ```npm install -g grunt-cli```
* Access to a running instance of [MongoDB](http://www.mongodb.org/). You can host this yourself or use services like [MongoLab](https://mongolab.com/welcome/).
* Access to local file system or CDN like [Amazon S3](http://aws.amazon.com/s3/).