module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mongodb : {
            test: {
                host: 'mongodb://localhost:27017/test',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/test.js'
            },
            dev : {
                host: 'mongodb://localhost:27017/grasshopper',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/dev.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadTasks('tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('seedDev', ['mongodb:dev']);


    grunt.registerTask('default', ['jshint']);

};