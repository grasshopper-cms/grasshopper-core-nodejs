---
title: Installation
uuid: installation
---
#### Installation

Grasshopper components are installed and managed via npm, the Node.js package manager. Before setting up Grasshopper ensure that your npm is up-to-date by running `npm update -g npm` (this might require sudo on certain systems).

The Grasshopper system includes 3 components (most deployments include all 3) and each can be installed separately.

* [Core](https://github.com/Solid-Interactive/grasshopper-core-nodejs)
* [API](https://github.com/Solid-Interactive/grasshopper-api-js)
* [Admin](https://github.com/Solid-Interactive/grasshopper-admin)

Now we don't want you to have to worry about configuring these separately so we created a handy [NPM](https://www.npmjs.org/package/grasshopper-cli) that helps you get going.

Just install the [grasshopper-cli](https://github.com/Solid-Interactive/grasshopper-cli) npm and follow the provided instructions.

    npm install -g grasshopper-cli