module.exports = function(grunt) {
  var staticUrl = 'coders/static/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    autoprefixer: {
      all: {
        expand: true,
        flatten: true,
        src: staticUrl + 'css/*.css',
        dest: staticUrl + 'css/'
      }
    },
    compass: {
      all: {
        options: {
          sassDir: staticUrl + 'src/',
          cssDir: staticUrl + 'css/',
          imagesDir: staticUrl + 'img/',
          outputStyle: 'compressed',
          relativeAssets: true
        }
      },
    },
    watch: {
      css: {
        files: ['**/*.scss'],
        tasks: ['compass', 'autoprefixer']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['compass', 'autoprefixer']);

};