module.exports = function (grunt) {
    'use strict';

    var host = "",
        async  = require('async'),
        client = require('mongodb').MongoClient;

    grunt.registerMultiTask('mongodb', 'Runs a nodemon monitor of your node.js server.', function () {
        var done = this.async(),
            collections = this.data.collections,
            data = require(this.data.data);

        host = this.data.host;

        grunt.log.writeln("Cleaning up test database, starting from clean slate.");

        async.series([
            function(callback){
                async.each(collections, cleanCollection, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Collections clean.");
                    callback();
                });
            },
            function(callback){
                async.each(data.users, importUsers, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `users` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(data.contentTypes, importContentTypes, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `contentTypes` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(data.nodes, importNodes, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `nodes` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(data.content, importContent, function(err){
                    if(err){ grunt.log.error(err); }
                    grunt.log.writeln("Test `content` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(data.hookEvents, importHookEvents, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `hookevents` imported.");
                    callback();
                });
            }

        ],function(err){
            if(err){
                grunt.log.error(err);
            }

            done();
        });
    });


    function cleanCollection(col, callback){
        client.connect(host, function(err, db) {
            if (err) grunt.log.errorlns(err);
            db.collection(col, function(err, collection){
                collection.remove({}, function(err, numRemovedDocs){
                    grunt.log.writeln(numRemovedDocs + " documents removed from " + col + " collection.");
                    db.close();
                    callback();
                });
            });
        });
    }

    function importData(col, obj, callback){
        client.connect(host, function(err, db) {
            if (err) grunt.log.errorlns(err);
            db.collection(col, function(err, collection){
                collection.insert(obj, function(err){
                    db.close();
                    callback();
                });
            });
        });
    }

    function importUsers(col, callback){
        importData('users', col, callback);
    }

    function importNodes(col, callback){
        importData('nodes', col, callback);
    }

    function importContentTypes(col, callback){
        importData('contenttypes', col, callback);
    }

    function importContent(col, callback){
        importData('content', col, callback);
    }

    function importHookEvents(col, callback){
        importData('hookevents', col, callback);
    }
};
