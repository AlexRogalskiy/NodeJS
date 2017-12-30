module.exports = function(grunt) {
	[
		'grunt-cafe-mocha',
		'grunt-contrib-jshint',
		'grunt-exec',
	].forEach(function(task) {
		grunt.loadNpmTasks(task);
	});

	grunt.initConfig({
		cafemocha: {
			all: { src: 'tests/*.js', options: { ui: 'tdd' }, }
		},
		jshint: {
			app: ['index.js', 'public/js**/*.js', 'lib/**/*.js'],
			tests: ['Gruntfile.js', 'public/tests/**/*.js', 'test/**/*.js'],
		},
		exec: {
			linkchecker:
				{ cmd: 'linkchecker http://localhost:3000' }
		},
	});

	grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']);
};