var fs = require ('fs');
var path = require('path');

var doc_server = require('./src/doc_server.js')(3555); // Initializes Server
var express = require('express');
var app = express();


// Express.js App
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendfile('index.html');
	res.end();
});

var http_server = app.listen(3000, function () {
	console.log('Listening...');
});


// Program Exit
process.on('exit', function () {
	console.log('close from exit')
	console.log(doc_server.document.buffer.join(''))
	doc_server.doc_server.close()

});

process.on('SIGINT', function () {
	console.log('SIGINT')
	process.exit()
});
