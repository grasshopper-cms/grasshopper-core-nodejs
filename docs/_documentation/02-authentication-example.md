---
title: Authentication Examples
uuid: authentication-example
language: javascript
---

// Basic Authentication Example
grasshopper.auth( 'basic', { username: '', password: '' } ).then( function( token ) {
    // Store user's token somewhere
} ).done();


// Google Authentication Example
grasshopper.auth( 'google', { code: 'TMP GOOGLE TOKEN' } ).then( function( token ) {
    // Store user's token somewhere
} ).done();

