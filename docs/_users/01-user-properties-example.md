---
title: User Properties Example
uuid: user-properties-example
language: asciidoc
---


* *_id*: Valid Mongo Object Id
* *role*: The users role, see below for more information on roles.
* *enabled*: Boolean indicating if the user is currently enabled or not.
* *firstname*: The users First Name.
* *lastname*: The users Last Name.
* *identities*: The Identities object represents the identities that the user has, this is private and will never be returned.
    * *basic*: The basic identity represents the most simple form of auth.
        * *username*: The Users username that they would use to login.
        * *salt*: Salt for password.
        * *hash*: Hash for password.
    * *google*: The Identity object representing google auth.
        * *id*: The users google id. Unique to all google users.
        * *accessToken*: An access token used to auth the user for google services. This token expires.
        * *refreshToken*: A token given by google to refresh the users access token.
* *displayname*: The users display name, if not set when creating a user, it will default to the login for basic auth, and the email address for google auth.
* *linkedidentities*: Array representing the identities the user has.
* *email*: The users email address.
* *profile*: The users profile, This can be an object containing anything.