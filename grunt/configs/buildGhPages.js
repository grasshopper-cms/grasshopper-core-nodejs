module.exports = function (grunt) {
    'use strict';

    grunt.config('buildGhPages', {
        ghPages : {},
        website : {
            options: {
                build_branch: "gh-pages",
                dist: "docs/_site",
                pull: true
            }
        }
    });
};