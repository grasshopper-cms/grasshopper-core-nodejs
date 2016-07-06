'use strict';

var BB = require('bluebird'),
    execSync = require('child_process').execSync,
    MongoClient = require('mongodb').MongoClient,
    running = false;

module.exports = start;

function start(grasshopper, mongoUrl) {

    process.stdout.write(execSync('grunt data:load'));

    var mongoPromise = new BB(function(resolve, reject) {
        if (! mongoUrl) {
            resolve();
        } else {
            // Use connect method to connect to the Server
            MongoClient.connect(mongoUrl, function(err, db) {
                if (err) {
                    reject(err);
                } else {
                    process.stdout.write('Connected correctly to Mongo server');
                    resolve(db);
                }
            });
        }
    });
    var ghPromise = new BB(function(resolve, reject) {

        // TODO: create way of stopping gh - or having inti call system/db start again
        if (running) {
           resolve();
        } else {
            grasshopper.event.channel('/system/*').on('error', function(payload, next){
                console.log('grasshopper error:', payload);
                next();
                reject();
            });

            grasshopper.event.channel('/system/db').on('start', function(payload, next) {
                running = true;
                next();
                resolve(grasshopper);
            });
        }
    });

    return BB.join(ghPromise, mongoPromise, function(gh, db) {
        return db;
    })
}
