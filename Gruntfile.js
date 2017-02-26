/*!
 * This file is part of maumau.
 *
 * Copyright (c) 1980 - 2016 Tobias Kratz
 * All rights reserved.
 */
/*
 * @author Tobias Kratz <kratz.tobias@googlemail.com>
 */

module.exports = function (grunt) {

  var configBridge = grunt.file.readJSON('bower_components/bootstrap/grunt/configBridge.json', { encoding: 'utf8' });

  grunt.initConfig({
    banner: "/*!\n * <%= pkg.name %> v<%= pkg.version %>\n" +
    "<%= pkg.homepage ? \" * \" + pkg.homepage + \"\\n\" : \"\" %>" +
    " *\n * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>\n" +
    " *\n * Date: <%= grunt.template.today(\"yyyy-mm-dd\") %>\n */\n",
    pkg: grunt.file.readJSON("package.json"),
    autoprefixer: {
      options: {
        browsers: configBridge.config.autoprefixerBrowsers
      },
      core: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>.css'
      }
    },
    concurrent: {
      dev: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['connect', 'watch']
      }
    },
    connect: {
      options: {
        port: 7583,
        keepalive: true,
        livereload: true
      },
      default: {
        options: {
          base: ["build/", "./"]
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            flatten: true,
            src: ['bower_components/bootstrap/dist/fonts/**'],
            dest: 'dist/fonts/',
            filter: 'isFile'
          }

          // includes files within path and its sub-directories
          // {expand: true, flatten: true, src: ['bower_components/bootstrap/dist/css/**'], dest: 'css/', filter: 'isFile'}
        ]
      }
    },
    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        sourceMap: false,
        sourceMapInlineSources: false,
        advanced: false
      },
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      }
    },
    csscomb: {
      options: {
        config: 'bower_components/bootstrap/less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      }
    },
    less: {
      compile: {
        options: {
          strictMath: true,
          sourceMap: false,
          outputSourceFiles: false,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'src/less/<%= pkg.name %>.less',
        dest: 'dist/css/<%= pkg.name %>.css'

      }
    },
    requirejs: {
      compile: {
        options: {
          out: 'build/<%= pkg.name %>.js',
          optimize: "none",
          include: ['<%= pkg.name %>'],
          removeCombined: true,
          baseUrl: "src",
          logLevel: 0,
          findNestedDependencies: true,
          inlineText: true,
          keepBuildDir: true,
          wrap: {
            start: "<%= banner %>",
            end: ""
          }
        }
      },
      almond: {
        options: {
          wrap: true,
          //optimize: "none",
          optimize: "uglify2",
          name: "../../bower_components/almond/almond",
          include: ["<%= pkg.name %>"],
          baseUrl: "src/js",
          out: "dist/js/<%= pkg.name %>.js",
          paths: {
            "jquery": "../../bower_components/jquery/dist/jquery",
            "bootstrap": "../../bower_components/bootstrap/dist/js/bootstrap",
          },
          wrap: {
            start: "<%= banner %>",
            end: ""
          }
        }
      }
    },
    watch: {
      src: {
        options: {
          // Start a live reload server on the default port 35729
          livereload: true,
        },
        files: ['src/js/**/*.js'],
        tasks: ["requirejs:almond"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csscomb');

  grunt.registerTask("dist-css", ["less:compile", "autoprefixer", "csscomb", "cssmin"]);
  grunt.registerTask("dist-js", ["requirejs:almond"]);
  grunt.registerTask("dist", ["copy:main", "dist-js", "dist-css"]);
  grunt.registerTask("default", ["dist"]);
};
