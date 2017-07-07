module.exports = function (grunt) {
  var config = require('./.screeps.json')
  require('load-grunt-tasks')(grunt)

  grunt.loadNpmTasks('grunt-screeps')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.registerTask('default', ['eslint', 'babel', 'screeps'])
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['*.js'],
            dest: 'dist/'
          }
        ]
      }
    },
    screeps: {
      options: {
        email: config.email,
        password: config.password,
        branch: config.branch,
        ptr: config.ptr
      },
      dist: {
        src: ['dist/*.js']
      }
    },
    watch: {
      scripts: {
        files: 'src/*.js',
        tasks: ['eslint', 'babel', 'screeps']
      }
    },
    eslint: {
      target: ['src/*.js']
    }
  })
}
