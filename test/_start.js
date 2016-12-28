'use strict';

var BB = require('bluebird'),
    execSync = require('child_process').execSync,
    running = false,
    grasshopper;

module.exports = start;

function start() {

    return BB
        .resolve()
        .then(function() {
            process.stdout.write(execSync('grunt data:load'));
        })
        .then(function() {
            return new BB(function(resolve, reject) {


                // TODO: create way of stopping gh - or having inti call system/db start again
                if (running) {
                    resolve(grasshopper);
                } else {
                    grasshopper = require('../lib/grasshopper').init(require('./fixtures/config'));
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
            })
        });
}
