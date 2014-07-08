---
uuid: core-example
language: javascript
---

var grasshopper = require('grasshopper-core'),
    config = require('./grasshopper-config'); //Config arguments

grasshopper.configure( function () {
    this.config = config;
} );
