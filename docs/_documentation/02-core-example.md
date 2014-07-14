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
grasshopper.auth( 'basic', { username: '', password: '' } ).then( function( response ) {
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
        /* Example Results
            {
                total: 1,
                limit: 100,
                skip: 0,
                results: [ {
                    _id: 53bec886ac932539223611c8,
                    fields: {
                        title: 'My content title',
                        body: ''
                    },
                    meta: {
                        type: 524362aa56c02c0703000001,
                        node: 526d5179966a883540000006,
                        labelfield: 'title',
                        typelabel: 'Page',
                        created: Date(),
                        lastmodified: Date()
                    }
                } ]
            }
        */
      },
      function( err ) {
        // Handle err here
        // <-- See rejection responses
      }
    ).done();
