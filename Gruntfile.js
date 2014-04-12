module.exports = function(grunt) {
    'use strict';
    var lineEnding = '\n',
        _ = require('underscore');;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        test: '',
        shell: {
            test: {
                command: 'mocha <%= debug %> --colors -R spec <%= test %>',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'shortlog' : {
                options : {
                    stderr : true,
                    stdout : false,
                    failOnError : true,
                    callback : function(err, stdout, stderr, cb) {
                        stdout = stdout.split(lineEnding);
                        _.each(stdout, function(line, index) {
                            stdout[index] = line.replace(/^\s*\d+\s+([^\s])/,'* $1');
                        });
                        grunt.config.set('contributors', stdout.join(lineEnding));
                        cb();
                    }
                },
                command : 'git --no-pager shortlog -ns HEAD'
            }
        },
        mongodb : {
            test: {
                host: 'mongodb://localhost:27017/test',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/test.js'
            },
            dev : {
                host: 'mongodb://localhost:27017/grasshopper',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/dev.js'
            }
        },
        releaseNotes : {
            main : {
                src : 'grunt/templates/README.template.md',
                dest : 'README.md',
                baseLinkPath : 'https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    require: true
                }
            }
        }
    });

    grunt.loadTasks('grunt/tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};