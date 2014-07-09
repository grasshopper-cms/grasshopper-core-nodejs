---
uuid: core-example
language: javascript
---

var grasshopper = require( 'grasshopper-core' ),
    config = require( './grasshopper-config' ),
    token = '';

grasshopper.configure( function () {
    this.config = config;
} );

// Example authenticating in the system and
// accessing the user's token via a promise
grasshopper.auth( username, password ).then( function( response ) {
    token = response;
} ).done();

// Request that will return content results
// that match a query
grasshopper.request( token ).content.query( {
        filters: [ {
            key: 'fields.label',
            cmp: '=',
            value: 'awesome'
        } ]
    } ).then(
      function( results ) {
        // Process your content query results
      },
      function( err ) {
        // Handle err here
      }
    ).done();
