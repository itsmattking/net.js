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
				tasks: ['build'],
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
		requirejs: {
			compile: {
				options: {
					name: "net",
					optimize: "uglify",
					mainConfigFile: "./build/config.js",
					out: "./dist/net.js"
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
						  if (req.url === '/test-post' && req.method === 'POST') {
							  res.setHeader('Content-Type', 'application/json');
							  res.end(JSON.stringify({abc: 123}));
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
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
 
	grunt.registerTask('build', ['jshint', 'requirejs:compile', 'qunit']);
  grunt.registerTask('default', ['connect', 'watch']);
};