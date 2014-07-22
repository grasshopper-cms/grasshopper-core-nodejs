module.exports = function (grunt) {
    'use strict';

    grunt.config('buildGhPages', {
        website : {
            options: {
                build_branch: "gh-pages",
                dist: "_docs",
                pull: true
            }
        }
    });
};