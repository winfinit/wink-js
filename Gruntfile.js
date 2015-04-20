'use strict';

module.exports = function (grunt) {

    //Default task runs tests, jshint and watches for changes.
    grunt.registerTask('default',
        ['mochaTest', 'jshint']);

    //Just run tests
    grunt.registerTask('test', ['env:test', 'mochaTest']);

    //Start mock server
    grunt.registerTask('mock', ['env:test', 'apimock']);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            test: {
                WINK_HOST: "localhost",
                WINK_PORT: 3999,
                NODE_TLS_REJECT_UNAUTHORIZED: 0,
                WINK_CONF: ".sample_wink_auth.json"
            }
        },

        //Mock server
        apimock: {
            options: {
              "port": 3998,
              "ssl-enable": true,
              "ssl-port": 3999,
              "ssl-host": "localhost",
              "ssl-key": "mock-server/server.key",
              "ssl-cert": "mock-server/server.crt",
              "src": "mock-server/wink_api.md",
              "keepalive": true
            }
        },

        //Tests
        mochaTest: {
            test: {
                options: {
                    "no-timeouts": true
                },
                src: ['test/**/*.js']
            }
        },

        //Clean code.
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: { src: ['index.js', 'lib/*.js', 'test/**/*.js']}
        },

        //Files to watch and actions to take when they are changed.
        watch: {
            files: ['index.js', 'test/**/*.js', 'lib/**/*.js'],
            tasks: ['jshint', 'mochaTest']
        }
    });

    // Load the plugins
    // Watch the file system for changes.
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Start mock server
    grunt.loadNpmTasks('grunt-apimock');
    // Start mock server
    grunt.loadNpmTasks('grunt-env');
    // Runs tests.
    grunt.loadNpmTasks('grunt-mocha-test');
    // Clean code validator.
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
