var express = require('express');
var app = express();
var sys = require('sys');

app.use(express.logger());
app.use(express.static(__dirname));
app.use(express.bodyParser());

app.get('/test.json', function(req, res) {
  res.render({test: 'yep'});
});

app.post('/test-post', function(req, res) {
  res.send(req.body);
});

app.listen(8080);