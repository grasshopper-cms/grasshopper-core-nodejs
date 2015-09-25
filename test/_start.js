'use strict';

var BB = require('bluebird'),
    execSync = require('child_process').execSync;

module.exports = start;

function start(grasshopper) {

    process.stdout.write(execSync('grunt data:load'));

    return new BB(function(resolve, reject) {

        grasshopper.event.channel('/system/*').on('error', function(payload, next){
            console.log('grasshopper error:', payload);
            next();
            reject();
        });

        grasshopper.event.channel('/system/db').on('start', function(payload, next) {
            next();
            resolve(grasshopper);
        });
    });
}
