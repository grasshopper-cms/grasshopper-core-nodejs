module.exports = function (grunt) {
    'use strict';
    var lineEnding = '\n',
        _ = require('underscore');
    grunt.config('shell', {
        test : {
            command : 'mocha <%= debug %> --colors -R spec <%= test %>',
            options : {
                stdout : true,
                stderr : true
            }
        },
        'shortlog' : {
            options : {
                stderr : true,
                stdout : false,
                failOnError : true,
                callback : function (err, stdout, stderr, cb) {
                    stdout = stdout.split(lineEnding);
                    _.each(stdout, function (line, index) {
                        stdout[index] = line.replace(/^\s*\d+\s+([^\s])/, '* $1');
                    });
                    grunt.config.set('contributors', stdout.join(lineEnding));
                    cb();
                }
            },
            command : 'git --no-pager shortlog -ns HEAD'
        }
    });
};