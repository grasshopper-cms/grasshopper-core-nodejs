module.exports = function (grunt) {
    'use strict';

    grunt.config('buildGhPages', {
        website : {
            options: {
                build_branch: "gh-pages",
                dist: "docs/_site",
                pull: true
            }
        }
    });
};