var sys = require('sys');
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			js: {
				files: [
					'src/**/*.js',
					'test/**/*.*'
				],
				tasks: ['test'],
				options: { nospawn: true }
			}
		},
		qunit:{
			target: {
				src: ['test/**/*.html']
			},
			options: {
				'--web-security' : false,
				'--local-to-remote-url-access' : true,
				'--ignore-ssl-errors' : true
			}
		},
		clean: {
			test: ['test/net.js']
		},
		requirejs: {
			compile: {
				options: {
					almond: true,
					baseUrl: "src",
					optimize: "uglify",
					out: "./dist/net.js",
					include: ["net"],
					wrap: {
						startFile: ["./build/start.frag", "./build/license.frag"],
						endFile: "./build/end.frag"
					}
				}
			},
			compileForTest: {
				options: {
					almond: true,
					baseUrl: "src",
					out: "./test/net.js",
					optimize: 'none',
					include: ["net"],
					wrap: {
						startFile: ["./build/start.frag", "./build/license.frag"],
						endFile: "./build/end.frag"
					}
				}
			}
		},
		// configure jshint task
		jshint: {
			options: {
				asi: false,
				bitwise: false,
				boss: false,
				browser: true,
				couch: false,
				curly: true,
				debug: false,
				devel: false,
				eqeqeq: true,
				eqnull: false,
				evil: false,
				expr: false,
				forin: false,
				globalstrict: true,
				globals: { "define": true },
				immed: true,
				jquery: true,
				latedef: true,
				laxbreak: false,
				loopfunc: false,
				mootools: false,
				newcap: false,
				noarg: true,
				node: false,
				noempty: false,
				nonew: true,
				nonstandard: true,
				nomen: false,
				onevar: false,
				passfail: false,
				plusplus: false,
				prototypejs: false,
				regexdash: true,
				regexp: false,
				rhino: false,
				undef: true,
				shadow: true,
				strict: false,
				sub: true,
				supernew: false,
				trailing: true,
				white: false,
				wsh: false,
				indent: 2,
				smarttabs: true
			},
			target: {
				src: ['src/**/*.js']
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: './test',
					middleware: function(connect, options, middlewares) {
						middlewares.push(function(req, res, next) {
							if (req.url === '/data/test-json' && req.method === 'GET') {
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({abc: 123}));
								return true;
							} else {
								return next();
							}
						});
						middlewares.push(function(req, res, next) {
							if (req.url === '/test-post' && req.method === 'POST') {
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({abc: 123}));
								return true;
							} else {
								return next();
							}
						});
						middlewares.push(function(req, res, next) {
							if (req.url === '/data/test' && req.method === 'GET') {
								res.end("Hi There");
								return true;
							} else {
								return next();
							}
						});
						middlewares.push(function(req, res, next) {
							if (req.url === '/data/test/weird-status' && req.method === 'GET') {
								res.statusCode = 444;
								res.end("Hi There");
								return true;
							} else {
								return next();
							}
						});
						middlewares.push(function(req, res, next) {
							if (req.url === '/data/test/server-error' && req.method === 'GET') {
								res.statusCode = 500;
								res.end("Hi There");
								return true;
							} else {
								return next();
							}
						});
						return middlewares;
					}
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('build', ['jshint', 'requirejs:compile', 'qunit']);
	grunt.registerTask('test', ['jshint', 'requirejs:compile', 'requirejs:compileForTest', 'qunit', 'clean']);
	grunt.registerTask('default', ['connect', 'watch']);
};
