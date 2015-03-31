module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    require('load-grunt-tasks')(grunt); // load all tasks
    require('time-grunt')(grunt);

    var jsLibs = [
            'src/bower_components/foundation/js/vendor/jquery.js',
            //'src/bower_components/foundation/js/vendor/jquery.cookie.js',
            //'src/bower_components/foundation/js/vendor/placeholder.js',
            'src/bower_components/foundation/js/vendor/fastclick.js',
            'src/bower_components/slick-carousel/slick/slick.js'
        ],

        jsFramework = [
            'src/bower_components/foundation/js/foundation/foundation.js',
            //'src/bower_components/foundation/js/foundation/foundation.abide.js',
            //'src/bower_components/foundation/js/foundation/foundation.accordion.js',
            //'src/bower_components/foundation/js/foundation/foundation.alert.js',
            //'src/bower_components/foundation/js/foundation/foundation.clearing.js',
            //'src/bower_components/foundation/js/foundation/foundation.dropdown.js',
            //'src/bower_components/foundation/js/foundation/foundation.equalizer.js',
            //'src/bower_components/foundation/js/foundation/foundation.interchange.js',
            //'src/bower_components/foundation/js/foundation/foundation.joyride.js',
            //'src/bower_components/foundation/js/foundation/foundation.magellan.js',
            //'src/bower_components/foundation/js/foundation/foundation.offcanvas.js',
            //'src/bower_components/foundation/js/foundation/foundation.orbit.js',
            //'src/bower_components/foundation/js/foundation/foundation.reveal.js',
            //'src/bower_components/foundation/js/foundation/foundation.slider.js',
            //'src/bower_components/foundation/js/foundation/foundation.tab.js',
            //'src/bower_components/foundation/js/foundation/foundation.tooltip.js',
            //'src/bower_components/foundation/js/foundation/foundation.topbar.js'
        ],

        jsProject = [
            'src/assets/js/plugins.js',
            'src/assets/js/app.js',
            'src/assets/js/_*.js'
        ],

        jsApp = jsLibs.concat(jsFramework, jsProject);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Options
        config: {
            srcPath:        'src',
            srcAssetsPath:  'src/assets',
            distPath:       'dist',
            distAssetsPath: 'dist/assets'
        },


        csslint: {
            options: {
                csslintrc: 'configs/.csslintrc'
            },
            src: [
                '<%= config.distAssetsPath %>/css/app.css'
            ]
        },

        jshint: {
            options: {
                jshintrc: 'configs/.jshintrc'
            },
            all: [
                'Gruntfile.js',
                jsProject
            ]
        },

        clean: {
            dist: {
                src: ['dist/*']
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.srcPath %>/bower_components/foundation/js/vendor/',
                        src: ['modernizr.js'],
                        dest: '<%= config.distAssetsPath %>/js/vendor'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.srcAssetsPath %>/fonts/',
                        src: ['**/*'],
                        dest: '<%= config.distAssetsPath %>/fonts'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.srcPath %>/bower_components/slick-carousel/slick/fonts/',
                        src: ['**/*'],
                        dest: '<%= config.distAssetsPath %>/fonts/slick'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.srcPath %>/bower_components/slick-carousel/slick/',
                        src: ['ajax-loader.gif'],
                        dest: '<%= config.distAssetsPath %>/layout/'
                    }
                ]
            }
        },

        sass: {
            options: {
                sourceMap: true,
                includePaths: [
                    '<%= config.srcPath %>/bower_components/foundation/scss'
                ]
            },
            dev: {
                options: {
                    sourceComments: 'normal'
                },
                files: {
                    '<%= config.distAssetsPath %>/css/app.css': '<%= config.srcAssetsPath %>/scss/app.scss'
                }
            }
        },

        cssmin: {
            options: {
                sourceMap: true
            },
            components: {
                files: {
                    // include extern css resources which can't be imported by sass
                    '<%= config.distAssetsPath %>/css/externals.css': [

                    ]
                }
            },
            dist: {
                files: {
                    '<%= config.distAssetsPath %>/css/app.min.css': [
                        //'<%= config.distAssetsPath %>/css/externals.css',
                        '<%= config.distAssetsPath %>/css/app_stripped.css'
                    ]
                }
            }
        },

        uncss: {
            options: {
                report: 'min',
                stylesheets: ['../../<%= config.distAssetsPath %>/css/app.css'],
                ignore       : [/\.slick\-[a-z]+/],
                timeout: 1000
            },
            dist: {
                files: {
                    '<%= config.distAssetsPath %>/css/app_stripped.css': ['<%= config.distPath %>/de/index.html']
                }
            }
        },

        assemble: {
            options: {
                production: false,
                flatten: true,
                layoutdir: '<%= config.srcPath %>/website/layouts',
                partials: '<%= config.srcPath %>/website/partials/**/*.hbs',
                assets: '<%= config.distAssetsPath %>',
                prettify: {indent: 4},
                helpers: [
                    'helper/helper-*.js'
                ]
            },
            website: {
                // Target-level options
                options: {
                    layout: 'default.hbs',
                    plugins: [
                        'handlebars-helper-compose',
                        'assemble-contrib-i18n',
                        'assemble-contrib-permalinks'
                    ],
                    i18n: {
                        data: [
                            '<%= config.srcPath %>/website/data/i18n.json',
                            '<%= config.srcPath %>/website/data/i18n/*.json'
                        ],
                        templates: ['<%= config.srcPath %>/website/pages/*.hbs']
                    },
                    permalinks: {
                        stripnumber: true,
                        structure: ':language/:mybasename.html',
                        patterns: [{
                            pattern: ':mybasename',
                            replacement: function() {
                                var basename = this.basename.split('-')[0];
                                return basename;
                            }
                        }]
                    }
                },
                files: [{
                    src: '!*.*',
                    dest: '<%= config.distPath %>/'
                }]
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                preserveComments: 'some'
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: false
                },
                files: {
                    '<%= config.distAssetsPath %>/js/app.js': [jsApp]
                }
            },
            prod: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    '<%= config.distAssetsPath %>/js/app.min.js': [jsApp]
                }
            }
        },

        imagemin: {
            target: {
                files: [{
                    expand: true,
                        cwd: '<%= config.srcAssetsPath %>/layout/',
                        src: ['**/*.{jpg,gif,svg,jpeg,png,ico}'],
                        dest: '<%= config.distAssetsPath %>/layout/'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.srcAssetsPath %>/content/img/',
                    src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                        dest: '<%= config.distAssetsPath %>/content/img/'
            }
                ]
            }
        },

        watch: {
            grunt: {files: ['Gruntfile.js']},

            sass: {
                files: '<%= config.srcAssetsPath %>/scss/*.scss',
                tasks: ['sass:dev', 'cssmin:dist']
            },

            js: {
                files: [
                    'Gruntfile.js',
                    jsApp
                ],
                tasks: ['jshint', 'uglify']
            },

            html: {
                files: [
                    '<%= config.srcPath %>/website/**/*'
                ],
                tasks: ['assemble']
            },

            images: {
                files: [
                    '<%= config.srcAssetsPath %>/layout/**/*',
                    '<%= config.srcAssetsPath %>/content/img/**/*'
                ],
                tasks: ['newer:imagemin']
            },

            assets: {
                files: [
                    '<%= config.srcAssetsPath %>/fonts/**/*'
                ],
                tasks: ['copy']
            },

            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= config.distAssetsPath %>/js/app.min.js',
                    '<%= config.distAssetsPath %>/css/app.min.css',
                    '<%= config.distAssetsPath %>/css/app.css',
                    '*.php'
                ]
            }
        }


    });

    grunt.loadNpmTasks('assemble');

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'assemble',
        //'csslint',
        'sass',
        'uncss:dist',
        //'cssmin:components',
        'cssmin:dist',
        'jshint',
        'uglify',
        'newer:imagemin:target'
    ]);

    grunt.registerTask('buildfast', [
        'assemble',
        //'csslint',
        'sass',
        //'cssmin:components',
        'cssmin:dist',
        'jshint',
        'uglify',
    ]);
}