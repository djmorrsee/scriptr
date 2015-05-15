var websocketserver = require('ws').Server
var express = require('express');
var app = express();

var doc_server = new websocketserver({port:3555});
doc_server.on('connection', function (socket) {
	socket.on('message', function (message) {
		console.log(message)
	});
});

app.get('/', function (req, res) {
	res.end()
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening to %s:%s', host, port);
});
