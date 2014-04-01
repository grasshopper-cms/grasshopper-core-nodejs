module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('test', 'Runs tests for your project.', function (arg) {
        var _ = require('underscore');

        if(_.isString(arg)){
            grunt.config.data.test = './test/' + arg;
        }

        grunt.task.run('mongodb:test');
        grunt.task.run('shell:test');
    });
};
