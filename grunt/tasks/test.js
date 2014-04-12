module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('test', 'Runs tests for your project.\n' +
    'The first arguments is the tests you want to run.\n' +
    'For example:\n' +
    'grunt test:content\n' +
    'The second argument is which debugger you want. If you don\t want a debugger, leave this blank.\n' +
    'If you want to use node-inspector enter that (requires: npm install -g node-inspector).\n' +
    'If you want to use the native node debugger enter "native".\n' +
    'For example:\n' +
    'grunt test::node-inspector', function (tests, debuggerType) {
        var _ = require('underscore'),
            testCommand = 'test';

        // Skip empty strings and undefined - tests is always a string or undefined
        if(tests){
            grunt.config.set('test', './test/' + tests);
        }

        if ('node-inspector' === debuggerType) {
            testCommand = 'testInspector'
        } else if ('native' === debuggerType) {
            grunt.config.set('debug', 'debug');
        }

        grunt.task.run(['mongodb:test', 'shell:' + testCommand]);
    });

    grunt.registerTask('debugTest', 'Shortcut for using the node-inspector. Tests to run can be supplied as the first ' +
    'argument.', function(tests) {
        grunt.task.run(['test:'+tests+':node-inspector']);
    });
};
