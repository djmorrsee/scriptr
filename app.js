var fs = require ('fs');
var path = require('path');

var doc_server = require('./src/doc_server.js')(3555); // Initializes Server
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendfile('index.html');
	res.end();
});

var http_server = app.listen(3000, function () {
	console.log('Listening...');
});

process.on('exit', function () {
	console.log('close')
});

process.on('SIGINT', function () {

	process.exit()
});
