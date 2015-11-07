module.exports = function(grunt) {
  var root = 'coders/'
      staticUrl = root + 'static/';

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
          sassDir: root + 'src/',
          cssDir: staticUrl + 'css/',
          imagesDir: staticUrl + 'img/',
          outputStyle: 'compressed',
          relativeAssets: true
        }
      },
    },
    jasmine: {
        test: {
            src: root + 'src/js/**/*.js',
            options: {
                specs: root + 'specs/**/*spec.js',
                vendor: [
                  'https://code.jquery.com/jquery-2.1.4.min.js',
                  staticUrl + 'vendor/js/jasmine_jquery/jasmine_jquery.js',
                  staticUrl + 'vendor/**/*.js'
                ]
            }
        }
    },
    watch: {
      css: {
        files: ['**/*.scss'],
        tasks: ['compass', 'autoprefixer']
      }
    },
    uglify: {
      build: {
        files: [{
            expand: true,
            cwd: root + 'src/js/',
            src: ['**/*.js', '*.js', '!**/*.min.js'],
            dest: staticUrl + 'js/',
            ext: '.min.js'
        }]
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['compass', 'autoprefixer', 'jasmine', 'uglify']);

};