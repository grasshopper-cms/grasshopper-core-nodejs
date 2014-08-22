'use strict';

var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('server', ['open', 'shell:server']);
};