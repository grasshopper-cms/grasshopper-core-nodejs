---
title: Google Auth Setup Example
uuid: google-auth-setup-example
language: javascript
---

// Get Google Oauth Url Example
$.ajax({
        dataType : 'json',
        url : yourApiEndpoint + '/googleurl',
        type : 'GET'
    })
    .done(function(url) {
        window.location.href = url;
    });

// Get Google Oauth Url while override the redirectUrl
$.ajax({
        dataType : 'json',
        url : yourApiEndpoint + '/googleurl',
        type : 'GET',
        headers : {'redirectUrl' : '/someOtherPage'}
    })
    .done(function(url) {
        window.location.href = url;
    });

// If Using Backbone, your router might look like
Router.extend({
    routes : {
        'login(/:token)' : 'displayLogin'
    }
});

// Accept the token
function doGoogleLogin(token) {
    // Do something with google token.
};
