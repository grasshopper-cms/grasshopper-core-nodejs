"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    collectionName = "contentTypes",
    schema = require('./schemas/contentType'),
    contentType = Object.create(crud,
        {model: {value: mongoose.model(collectionName, schema)}}
    );

module.exports = contentType;