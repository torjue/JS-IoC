'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			gruntfile: {
				src: 'Gruntfile.js',
				options: {
					node: true
				}
			},
			subsumer: {
				src: [
					'src/subsumer.js'
				]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %> - ' +
						'http://torjue.mit-license.org */\n'
			},
			build: {
				files: {
					'build/subsumer.min.js': ['src/subsumer.js']
				}
			}
		},
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= uglify.options.banner %>'
			},
			dist: {
				src: ['src/subsumer.js'],
				dest: 'build/subsumer.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['jshint', 'uglify', 'concat']);
};