![Grasshopper Logo](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-core.jpg)

---------------------------------------------------------------

[![NPM](https://nodei.co/npm/grasshopper-core.png)](https://nodei.co/npm/grasshopper-core/)

[![Build Status](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs.png?branch=master)](https://travis-ci.org/Solid-Interactive/grasshopper-core-nodejs)

### Grasshopper is an everybody friendly, flexible, extensible CMS.

### [Documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html)

A CMS for the people, a great experience for developers, users and customers. Use Grasshopper to drastically speed up development for distributed systems. Support your clients better.

![Create, Share, Present](http://solid-interactive.github.io/grasshopper-core-nodejs/images/create-share-present.png)

By standardizing your development workflow, you can spend more time building your public facing applications and less time building backend systems, APIs and administrations.

Grasshopper focuses on user happiness, not just developer happiness. Grasshopper provides tools for everyone involved in a project, developers, content managers, clients and customers alike.

**Using Grasshopper, developers get**

* An easy to use SDK, a ready to go REST API, built in concepts like user management and permissions, an open system that is both flexible and extensible.
* High performance application stack built on Node.js. Hooks and events into the system to completely customize the handling of data and unlocking it's potential.
* Consistent tools will that help you save time and delight your users. Using Grasshopper will elimiate much of the boring, boilerplate code that you have to write for every project.
* The Grasshopper system can be run anywhere and has native cloud support that keeps growing. You can use services like Heroku or host on your own systems.

**Using Grasshopper, managers get**

* A ready to go environment to start working right away. No more technology black holes where you have to wait until the end of the project to do your job.
* Faster access to the tools you need. When developers don't have to write code to give you what you want, you will get it faster.
* Intuitive and useful content management screens that can have any definition. Any type of content can be defined, organized and managed without a developer having to write any code.
* Piece of mind knowing that you can increase client engagement by giving them something to work on sooner and give them less time to think about changes.


### Grasshopper Core

---------------------------------------------------------------------------------

Core is responsible for all the heavy lifting of the framework. Core includes methods for managing users (data and access), content types, content, nodes (or folders) and assets.

For more information see our [official documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#gettingstarted).


### Grasshopper Components

---------------------------------------------------------------------------------

![Stack](http://solid-interactive.github.io/grasshopper-core-nodejs/images/stack.png)

* [GRASSHOPPER CLI](https://github.com/Solid-Interactive/grasshopper-cli)
* [GRASSHOPPER API](https://github.com/Solid-Interactive/grasshopper-api-js)
* [GRASSHOPPER ADMIN](https://github.com/Solid-Interactive/grasshopper-admin)


### Getting Started

------------------------------------------------------------------

The best thing to do is review the [Grasshopper website](http://solid-interactive.github.io/grasshopper-core-nodejs) and review the [documentation]([official documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html)).

If you want to install grasshopper right away you should use the [CLI](https://github.com/Solid-Interactive/grasshopper-cli). Installing Grasshopper is super simple. Once your machine is configured, creating a new project is as easy as typing `grasshopper fly`.

The installation process fully configures working instances of [core](https://github.com/Solid-Interactive/grasshopper-core-nodejs), [api](https://github.com/Solid-Interactive/grasshopper-api-js) and [admin](https://github.com/Solid-Interactive/grasshopper-admin) for you.


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

<%= releaseNotes.notes %>

## Contributors (`git shortlog -s -n`)

<%= contributors %>

## Dev Notes

To create the readme, update the release notes dir and package.json.version at a minimum. If needed update README.template.md.
Then run `grunt readme`.

Test data is loaded from `dev/fixtures`. There is a bundled grasshopper admin that can be used to modify test data.

The procedure to edit test data is:

```bash
# This will clear the db and load from fixtures
grunt data:load

# this will server admin at http://localhost/admin
grunt server

# now edit using admin
# once finished save the data back to fixtures with:
grunt data:save
```

### [Documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html)

_<%= warning + ' Created: ' + grunt.template.today('yyyy-mm-dd hh:MM:ss') %>_