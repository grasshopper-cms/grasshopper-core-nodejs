(function(){
    "use strict";

    var data = {},
        ObjectID = require('mongodb').ObjectID,
        _ = require('lodash');

    _.each([
        'hookevents',
        'users',
        'nodes',
        'contentTypes',
        'content'
    ], function(dataType) {
        data[dataType] = require('./db/test/' + dataType)(ObjectID);
    });

    module.exports = data;
})();

