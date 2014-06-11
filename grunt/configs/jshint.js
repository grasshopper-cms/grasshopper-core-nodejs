module.exports = function (grunt) {
    'use strict';
    grunt.config('jshint', {
        files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
            // options here to override JSHint defaults
            jshintrc: '.jshintrc'
        }
    });
};