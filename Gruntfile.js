module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      },
      eslint: {
        command: 'eslint client/App/*/*.js server/*/*.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('lint', ['shell:eslint']);

  grunt.registerTask('test', ['mochaTest', 'lint']);

  grunt.registerTask('upload', function(n) {
    grunt.task.run([ 'shell:prodServer' ]);
  });

  grunt.registerTask('deploy', ['lint', 'mochaTest', 'upload']);

};
