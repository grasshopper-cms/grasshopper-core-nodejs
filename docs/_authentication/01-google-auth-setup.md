---
title: Setup Google Login
uuid: google-auth-setup
---

##### Setup Google Login


1. Ensure that the [identities.google object on your ghapi.json](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#projectconfiguration) is correctly setup.
2. Ensure that you have added both a a redirect uri and a javascript origin to your [Google Developer Console OAuth configuration](https://developers.google.com/console).
    * The javascript origin is the root of your website. For example:
        * `http://localhost:3000`
        * `https://www.grasshopper-admin-sample.herokuapp.com`
    * The redirect uri should be the root of your website with the following append to the end `/oauth2callback`. This endpoint is where google will send the authenticated users temporary token. This endpoint already exists in Grasshopper-Api.
    This would create the following url's from the examples mentioned above:
        * `http://localhost:3000/auth2Callback`
        * `https://www.grasshopper-admin-sample.herokuapp.com/oauth2callback`
3. Setup the methods to get the googleAuthUrl from API then send the user there.
    The `GET /googleurl` endpoint is already available on Api.
    * This endpoint is not authenticated.
    * This endpoint can also take an override redirect url. If you use this override, it will redirect the user back to that url with the grasshopper token in the url after all auth work is done.
4. Modify your applications routes to collect the grasshopper token from the redirected route.
    Grasshopper API will redirect the user back to your app with the grasshopper token appended to the redirectUrl you specified in your config. If you overrode this by passing it as a header in the `/geturl` request, then it will be appended to that url.
    * If your redirectUrl in your config was: `/login`, then the user is redirected to `/login/{ grasshopperToken }`.
    * If you overrode your redirectUrl then you will see: `/someOtherPage/{ grasshopperToken }`.
    * Your route will need to be able to accept the returned url, in backbone, this might look like: `'login(/:token)'`.
        Where the `()` signifies an optional param. Then a `/`. Then a `:token`.  The word 'token' in the example is important as this will be passed the the route function as a parameter.
5. Once you have a handle on the grasshopper token, save it to local storage, prepended with 'Google '.

Check out our sample projects for examples of both of these authentication methods in working applications.