module.exports = function (grunt) {
    'use strict';
    grunt.config('jshint', {
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
    });
};