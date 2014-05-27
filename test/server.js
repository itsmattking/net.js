var qs = require('querystring');
var sys = require('sys');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();
var formidable = require('formidable');
// parse application/json and application/x-www-form-urlencoded
app.use(bodyParser())

/**
 * net/ajax test endpoints
 */

app.get('/net/ajax', function(req, res, next) {
	
	if (req.get("My-Custom-Header")) {
		sys.inspect(req);
		res.set("My-Custom-Header", req.get("My-Custom-Header"));
	}
	res.end("GET Request");
});
app.post('/net/ajax', function(req, res, next) {
	res.end('POST Request');
});
app.get('/net/ajax/status/:status', function(req, res, next) {
	res.statusCode = req.params.status;
	res.end("GET with Status");
});
app.get('/net/ajax/redirect', function(req, res, next) {
	res.redirect(302, '/net/ajax/redirect-destination');
});
app.get('/net/ajax/redirect-destination', function(req, res, next) {
	res.statusCode = 200;
	res.end("Redirect Destination");
});

/**
 * net/json test endpoints
 */

app.get('/net/json', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({abc: 123}));
});
app.get('/net/json/malformed', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.end('lllll');
});
app.get('/net/json/empty', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	res.end('');
});

/**
 * net/form test endpoints
 */

app.post('/net/form', function(req, res, next) {
	res.statusCode = 200;
	res.end(qs.stringify(req.body));
});
app.put('/net/form', function(req, res, next) {
	res.statusCode = 200;
	res.end(qs.stringify(req.body));
});
app.post('/net/form/encoded', function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		res.statusCode = 200;
		res.end(qs.stringify(fields));
	});
});

module.exports = app;
