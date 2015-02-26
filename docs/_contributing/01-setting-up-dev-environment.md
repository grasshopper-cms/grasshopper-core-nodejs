---
title: Setting up your development environment
uuid: environment-setup
---
#### Setting up your development environment


If you are doing full stack development on Grasshopper you should setup all projects in the solution to work locally.

The grasshopper-admin project comes with a server directory that can run grasshopper-api and the grasshopper-api project loads in grasshopper-core.

It is really easy to setup local versions of each of the projects so that you can do all of your development without publishing npms.

The key is to link your local grasshopper-core and grasshopper-api npms to be treated as globals.

More information on the technique using [NPM LINK](https://www.npmjs.org/doc/cli/npm-link.html) can be found [here](https://www.npmjs.org/doc/cli/npm-link.html).

##### Before you start

Make sure that you development machine meets the minimum [REQUIREMENTS](documentation.html#requirements)

To test locally, you will be running a node app from `/server`. This app will run an instance of grasshopper-api. The app must be configured to serve the correct data (local or remote).

The configs are pulled from the environmental variable `GRASSHOPPER_CONFIG` if available or the fallback `ghapi.json` file.

Setup `ghapi.json` in the `/server` directory of the `grasshopper-admin` project. This is the config file that has the server and database info for your local dev work and it is `.gitignored`.

For an example of what this should look like, see [CONFIGURING YOUR PROJECT](#projectconfiguration).

##### Development server

The `grunt server` task will start a local express server running the API. It will also start a watch for the files in the `admin` project. If you save a file then it will be updates and the page will be refreshed.

If you make changes to your local `core` or `api` projects. This just restart the node server process to apply your changes.

##### When you finished

Once you are have finished your dev work on `grasshopper-api` or `grasshopper-core`, you should publish the npm or submit a merge request.

To test the new npm, you should unlink `grasshopper-api` and/or `grasshopper-core` and pull the dependency in from npm:

```bash
cd ~/workspace/grasshopper-admin/server
npm uninstall grasshopper-api
npm install --save grasshopper-api@[the newly published version]
```

Documentation around removing npm dependencies is available at:

[https://www.npmjs.org/doc/cli/npm-uninstall.html](https://www.npmjs.org/doc/cli/npm-uninstall.html)

[https://www.npmjs.org/doc/cli/npm-rm.html](https://www.npmjs.org/doc/cli/npm-rm.html) (npm unlink -h)