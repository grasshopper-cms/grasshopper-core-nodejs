module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('docs', 'Builds website documentation.', function () {

        grunt.log.writeln("Building website documentation...");
        grunt.task.run(['shell:jekyllBuild', 'buildGhPages:website']);
    });
};
