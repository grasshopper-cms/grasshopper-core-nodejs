module.exports = function (grunt) {
    'use strict';
    grunt.registerTask('db:dev', ['mongodb:dev']);
    grunt.registerTask('db:test', ['mongodb:test']);
};
