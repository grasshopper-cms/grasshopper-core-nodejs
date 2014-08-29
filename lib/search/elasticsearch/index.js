module.exports = (function () {
    'use strict';

    var engine = {},
        elasticsearch = require('elasticsearch'),
        client = new elasticsearch.Client({
            host: 'localhost:9200'
        }),
        createError = require('../../utils/error'),
        q = require('q'),
        fs = require('fs'),
        path = require('path'),
        url = require('url'),
        internal = {};

    engine.query = function (params) {
        var deferred = q.defer();

        client.search(params)
            .then(function (body) {
                deferred.resolve(body);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    engine.ping = function () {
        var deferred = q.defer();

        client.ping({
            requestTimeout: 1000,
            // undocumented params are appended to the query string
            hello: "elasticsearch!"
        })
            .then(function () {
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            })

        return deferred.promise;
    }

    return engine;
})();
