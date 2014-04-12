module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('test', 'Runs tests for your project.\n' +
    'The first arguments is the tests you want to run.\n' +
    'For example:\n' +
    'grunt test:content\n' +
    'The second argument is whether you want the debugger.\n' +
    'For example after putting a "debugger" into the code:\n' +
    'grunt test::1', function (tests, debug) {
        var _ = require('underscore');

        if(_.isString(tests)){
            grunt.config.set('test', './test/' + tests);
        }

        if (debug) {
            grunt.config.set('debug', 'debug');
        }

        grunt.task.run(['mongodb:test', 'shell:test']);
    });
};
