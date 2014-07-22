![Grasshopper Logo](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-core.jpg)

---------------------------------------------------------------

[![NPM](https://nodei.co/npm/grasshopper-core.png)](https://nodei.co/npm/grasshopper-core/)

[![Build Status](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs.png?branch=master)](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs)

### Grasshopper is an everybody friendly, flexible, extensible CMS.

A CMS for the people, a great experience for developers, users and customers. Use Grasshopper to drastically speed up development for distributed systems. Support your clients better.

---------------------------------------------------------------------------------

By standardizing your development workflow, you can spend more time building your public facing applications and less time building backend systems, APIs and administrations.

Grasshopper focuses on USER happiness, not just developer happiness. Grasshopper provides tools for everyone involved in a project, developers, content managers, clients and customers alike.

Using Grasshopper, developers get

* An easy to use SDK, a ready to go REST API, built in concepts like user management and permissions, an open system that is both flexible and extensible.
* High performance application stack built on Node.js. Hooks and events into the system to completely customize the handling of data and unlocking it's potential.
* Consistent tools will that help you save time and delight your users. Using Grasshopper will elimiate much of the boring, boilerplate code that you have to write for every project.
* The Grasshopper system can be run anywhere and has native cloud support that keeps growing. You can use services like Heroku or host on your own systems.

Using Grasshopper, managers get

* A ready to go environment to start working right away. No more technology black holes where you have to wait until the end of the project to do your job.
* Faster access to the tools you need. When developers don't have to write code to give you what you want, you will get it faster.
* Intuitive and useful content management screens that can have any definition. Any type of content can be defined, organized and managed without a developer having to write any code.
* Piece of mind knowing that you can increase client engagement by giving them something to work on sooner and give them less time to think about changes.


### Grasshopper Core

---------------------------------------------------------------------------------

Core is responsible for all the heavy lifting of the framework. Core includes methods for managing users (data and access), content types, content, nodes (or folders) and assets.

For more documentation see our [official documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#gettingstarted).


### Grasshopper Components

---------------------------------------------------------------------------------

![Stack](http://solid-interactive.github.io/grasshopper-core-nodejs/images/stack.png)

* [GRASSHOPPER API](https://github.com/Solid-Interactive/grasshopper-api-js)
* [GRASSHOPPER ADMIN](https://github.com/Solid-Interactive/grasshopper-admin)
* [GRASSHOPPER CLI](https://github.com/Solid-Interactive/grasshopper-cli)


### Getting Started

------------------------------------------------------------------

The best thing to do is review the [Grasshopper website](http://solid-interactive.github.io/grasshopper-core-nodejs) and review the [documentation]([official documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html)).

If you want to install grasshopper right away you should use the CLI. Installing Grasshopper is super simple. Once your machine is configured, creating a new project is as easy as typing `grasshopper fly`.

The installation process fully configures working instances of [core](https://github.com/Solid-Interactive/grasshopper-core-nodejs), [api](https://github.com/Solid-Interactive/grasshopper-api-js) and [admin](https://github.com/Solid-Interactive/grasshopper-admin) for you.

See the example of how to install the NPM and setup a new project. We assume that all of the prerequisite software is already installed.

Watch a video of an installation (less than a minute):

<div id="container">Loading the player ...</div>

<script type="text/javascript">
 jwplayer("container").setup({
 flashplayer: "js/vendor/jwplayer/player.swf",
 file: "http://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-cli-fly.mp4",
 height: 270,
 poster: "http://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-cli-fly.png",
 width: 480 });
</script>


### Running Tests

-------------------------------------------------------

* $: ```grunt test```

### Building Documentation

-------------------------------------------------------

* $: ```grunt docs```


### Compiling Readme

-------------------------------------------------------

* $: ```grunt readme```

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

Grasshopper CORE JS is released under a [MIT license](https://github.com/Solid-Interactive/grasshopper-core-nodejs/blob/master/LICENSE).

## Release Notes

* 0.1.6 - 2014-03-30 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.1.6_2014-03-30.md)
* 0.1.7 - 2014-03-29 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.1.7_2014-03-29.md)
* 0.1.9 - 2014-04-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.1.9_2014-04-01.md)
* 0.1.10 - 2014-04-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.1.10_2014-04-01.md)
* 0.1.11 - 2014-04-02 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.1.11_2014-04-02.md)
* 0.2.0 - 2014-04-02 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.2.0_2014-04-02.md)
* 0.2.3 - 2014-04-08 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.2.3_2014-04-08.md)
* 0.2.4 - 2014-04-10 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.2.4_2014-04-10.md)
* 0.3.1 - 2014-04-10 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.3.1_2014-04-10.md)
* 0.4.1 - 2014-04-11 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.1_2014-04-11.md)
* 0.4.2 - 2014-04-11 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.2_2014-04-11.md)
* 0.4.3 - 2014-04-14 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.3_2014-04-14.md)
* 0.4.4 - 2014-04-14 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.4_2014-04-14.md)
* 0.4.5 - 2014-04-15 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.5_2014-04-15.md)
* 0.4.6 - 2014-04-16 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.6_2014-04-16.md)
* 0.4.7 - 2014-04-17 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.7_2014-04-17.md)
* 0.4.8 - 2014-04-30 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.8_2014-04-30.md)
* 0.4.9 - 2014-04-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.9_2014-04-21.md)
* 0.4.10 - 2014-04-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.10_2014-04-21.md)
* 0.4.11 - 2014-04-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.11_2014-04-21.md)
* 0.4.12 - 2014-04-22 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.12_2014-04-22.md)
* 0.4.13 - 2014-04-23 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.4.13_2014-04-23.md)
* 0.11.18 - 2014-04-23 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.11.18_2014-04-23.md)
* 0.12.0 - 2014-06-11 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.12.0_2014-06-11.md)
* 0.12.1 - 2014-06-11 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.12.1_2014-06-11.md)
* 0.12.2 - 2014-06-11 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.12.2_2014-06-11.md)
* 0.13.0 - 2014-06-24 - [features](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.0_2014-06-24.md)
* 0.13.1 - 2014-06-24 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.1_2014-06-24.md)
* 0.13.2 - 2014-06-24 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.2_2014-06-24.md)
* 0.13.2 - 2014-06-25 - [initial release](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.2_2014-06-25.md)
* 0.13.3 - 2014-06-26 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.3_2014-06-26.md)
* 0.13.4 - 2014-06-30 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.4_2014-06-30.md)
* 0.13.5 - 2014-07-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.5_2014-07-01.md)
* 0.13.6 - 2014-07-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.6_2014-07-01.md)
* 0.13.7 - 2014-07-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.7_2014-07-01.md)
* 0.13.8 - 2014-07-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.8_2014-07-01.md)
* 0.13.9 - 2014-07-01 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.9_2014-07-01.md)
* 0.13.10 - 2014-07-02 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.10_2014-07-02.md)
* 0.13.11 - 2014-07-03 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.11_2014-07-03.md)
* 0.13.12 - 2014-07-08 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.12_2014-07-08.md)
* 0.13.13 - 2014-07-08 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.13_2014-07-08.md)
* 0.13.14 - 2014-07-09 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.14_2014-07-09.md)
* 0.13.15 - 2014-07-08 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.15_2014-07-08.md)
* 0.13.16 - 2014-07-09 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.16_2014-07-09.md)
* 0.13.17 - 2014-07-10 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.17_2014-07-10.md)
* 0.13.18 - 2014-07-10 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.18_2014-07-10.md)
* 0.13.19 - 2014-07-10 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.19_2014-07-10.md)
* 0.13.20 - 2014-07-14 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.20_2014-07-14.md)
* 0.13.21 - 2014-07-14 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.21_2014-07-14.md)
* 0.13.22 - 2014-07-14 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.22_2014-07-14.md)
* 0.13.23 - 2014-07-15 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.23_2014-07-15.md)
* 0.13.24 - 2014-07-15 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.24_2014-07-15.md)
* 0.13.25 - 2014-07-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.25_2014-07-21.md)
* 0.13.26 - 2014-07-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.26_2014-07-21.md)
* 0.13.27 - 2014-07-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.27_2014-07-21.md)
* 0.13.28 - 2014-07-21 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.28_2014-07-21.md)
* 0.13.29 - 2014-07-22 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.29_2014-07-22.md)
* 0.13.30 - 2014-07-22 - [patches](https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/release_notes/0.13.30_2014-07-22.md)


## Contributors (`git shortlog -s -n`)

* Travis McHattie
* Greg Larrenaga
* Peter Ajtai
* Cooper Hilscher
* Valentine Nesterov
* Eric Beringer


## Dev Notes

To create the readme, update the release notes dir and package.json.version at a minimum. If needed update README.template.md.
Then run `grunt readme`.

_Compiled file. Do not modify directly. Created: 2014-07-22 02:04:40_