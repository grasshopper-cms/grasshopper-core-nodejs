module.exports = function (grunt) {
    'use strict';
    grunt.config('releaseNotes' , {
        main : {
            src : 'grunt/templates/README.template.md',
            dest : 'README.md',
            baseLinkPath : 'https://github.com/Solid-Interactive/grasshopper-core-nodejs/tree/master/'
        }
    });
};
