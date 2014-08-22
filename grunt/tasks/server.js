'use strict';

var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('server', ['shell:server']);
    grunt.registerTask('server:load', ['data:load', 'shell:server']);
};