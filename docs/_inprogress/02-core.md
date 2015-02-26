---
title: Core
uuid: core
---
### Grasshopper Core

Core is responsible for all the heavy lifting of the framework. Core includes methods for managing users, permissions, content types, content, nodes (or folders) and assets.

##### Requests

The main entry point into Grasshopper Core is through a `request` function. The `request` function expects a logged in user's `token` and returns an object that contains all of the available entities. The `token` argument is used to establish a user's permissions.

```javascript
    grasshopper.request(token).auth.<function>(<args>);
    grasshopper.request(token).content.<function>(<args>);
    grasshopper.request(token).contentTypes.<function>(<args>);
    grasshopper.request(token).nodes.<function>(<args>);
    grasshopper.request(token).assets.<function>(<args>);
    grasshopper.request(token).tokens.<function>(<args>);
    grasshopper.request(token).users.<function>(<args>);
```

##### Permissions

By default most functions require the user to identify themselves before they can be called. Core functions will validate if a user has a high enough user role to perform a task. [Authentication](#core-auth) is covered in more detail below.

Currently supported roles are (ADMIN, EDITOR, AUTHOR, READER, EXTERNAL, NONE)

##### Promises

All functions in core return [promises](https://www.promisejs.org/). The idea behind promises is that a promise represents the result of an asynchronous operation. A promise is in one of three different states:

* `pending` - The initial state of a promise.
* `fulfilled` - The state of a promise representing a successful operation.
* `rejected` - The state of a promise representing a failed operation.

Once a promise is fulfilled or rejected, it is immutable (i.e. it can never change again). To learn more about promises visit [https://www.promisejs.org/](https://www.promisejs.org/).


###### Rejected Responses

If a function fails for any reason and the promise is rejected. You can expect an error object like the ones below:

```javascript
    // Standardized Error Responses
    { code: 400, message: ‘[Reason request was bad]’ } // Invalid function arguments
    { code: 401, message: ‘Unauthorized’ } // Auth info not provided
    { code: 403, message: ‘Forbidden’ } // Not enough priviledges
    { code: 500, message: ‘[Exception reason]’ } // Unhandled server exception
    { code: 404, message: ‘Resource could not be found.’ }
    { code: 408, message: ‘Service Timeout’ }
    { code: 503, message: ‘Service Unavailable.’ }
```
