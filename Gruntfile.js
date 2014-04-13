module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('grunt/configs');
    grunt.loadTasks('grunt/tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};