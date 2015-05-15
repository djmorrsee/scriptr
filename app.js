var fs = require ('fs');
var path = require('path');

var websocketserver = require('ws').Server;

var express = require('express');
var app = express();

app.use(express.static('public'));

var doc_server = new websocketserver({port:3555});
doc_server.on('connection', function (socket) {
	socket.on('message', function (message) {
		console.log(message);
	});
});

app.get('/', function (req, res) {
	res.sendfile('index.html');
	res.end();
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening to %s:%s', host, port);
});
