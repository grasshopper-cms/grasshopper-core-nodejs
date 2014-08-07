---
title: Authentication
uuid: core-auth
---
#### Authentication

Membership is a critical component to almost all applications. Grasshopper's authentication methods are fully extensible, and it contains a robust permissions mechanism that allows you to protect data based off of the application’s requirements.

Supported Authentication Methods

* Basic: This is the typical username and password method
* Google: Allows you to authenticate with your Gmail account.

##### How To Setup Google Login


1. Ensure that the [identities.google object on your ghapi.json](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#projectconfiguration) is correctly setup.
1. Ensure that you have added both a a redirect uri and a javascript origin to your google developer console OAuth configuration.
    * The javascript origin is the root of your website. For example:
        * `http://localhost:3000`
        * `https://www.grasshopper-admin-sample.herokuapp.com`
    * The redirect uri should be the root of your website with the following append to the end `/oauth2callback`. This endpoint is where google will send the authenticated users temporary token. This endpoint already exists in Grasshopper-Api.
    This would create the following url's from the examples mentioned above:
        * `http://localhost:3000/auth2Callback`
        * `https://www.grasshopper-admin-sample.herokuapp.com/oauth2callback`
1. Setup the methods to get the googleAuthUrl from API then send the user there. This might look like:

    ```javascript
    $.ajax({
            dataType : 'json',
            url : yourApiEndpoint + '/googleurl',
            type : 'GET'
        })
        .done(function(url) {
            window.location.href = url;
        });
    ```

    The important part of the above is the `/googleurl` endpoint that is available on Api.
    * This endpoint is not authenticated.
    * This endpoint can also take an override redirect url. If you use this override, it will redirect the user back to that url with the grasshopper token in the url after all auth work is done.

    ```javascript
    $.ajax({
            dataType : 'json',
            url : yourApiEndpoint + '/googleurl',
            type : 'GET',
            headers : {'redirectUrl' : '/someOtherPage'}
        })
    ```

1. Modify your applications routes to collect the grasshopper token from the redirected route.
    Grasshopper API will redirect the user back to your app with the grasshopper token appended to the redirectUrl you specified in your config. If you overrode this by passing it as a header in the `/geturl` request, then it will be appended to that url.

    * If your redirectUrl in your config was: `/login`, then the user is redirected to `/login/{ grasshopperToken }`.
    * If you overrode your redirectUrl then you will see: ` /someOtherPage/{ grasshopperToken }`.

    Your route will need to be able to accept the returned url, in backbone, this might look like:

    ```javascript
    'login(/:token)'
    ```

    Where the `()` signifies an optional param. Then a `/`. Then a `:token`.  The word 'token' in the example is important as this will be passed the the route function as a parameter.

1. Once you have a handle on the grasshopper token, save it to local storage, prepended with 'Google '.

Check out our sample projects for examples of both of these authentication methods in working applications.