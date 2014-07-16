module.exports = function (grunt) {
    'use strict';
    grunt.config('mongodb', {
        test: {
            host: 'mongodb://localhost:27017/test',
            collections: ['users','contenttypes','nodes','hookevents','content', 'tokens'],
            data: './fixtures/mongodb/test.js'
        },
        dev : {
            host: 'mongodb://localhost:27017/grasshopper',
            collections: ['users','contenttypes','hookevents','nodes','content', 'tokens'],
            data: './fixtures/mongodb/dev.js'
        }
    });
};