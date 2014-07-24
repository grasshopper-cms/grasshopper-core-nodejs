module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('grunt/configs');
    grunt.loadTasks('grunt/tasks');
    grunt.loadNpmTasks('grunt-build-gh-pages');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};