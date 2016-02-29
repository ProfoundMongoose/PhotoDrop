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

    // nodemon: {
    //   dev: {
    //     script: 'server.js'
    //   }
    // },

    // uglify: {
    //   my_target: {
    //     files: {
    //       './public/dist/builtUglify.js': ['./public/dist/built.js'],
    //     }
    //   }
    // },

    // eslint: {
    //   target: [
    //     'server/*.js', 'server/config/*.js', 'server/photos/*.js', 'server/users/*.js',
    //     'client/App/Components/*.js', 'client/App/Utils/*.js'
    //   ]
    // },

    shell: {
      prodServer: {
        command: 'git push live master'
      },
      eslint: {
        command: 'eslint client/App/Components/Camera.js'
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  // grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('build', ['uglify']);

  grunt.registerTask('lint', ['shell:eslint']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell' ])
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['eslint', 'mochaTest', 'upload']);

};
