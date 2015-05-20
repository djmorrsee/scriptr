var fs = require ('fs');
var path = require('path');

var sass_middleware = require('node-sass-middleware')

var doc_server = require('./src/doc_server.js')(3555); // Initializes Server
var express = require('express');
var app = express();


// Express.js App
app.use(sass_middleware({
	src:__dirname+'/public',
	dest:__dirname+'/public',
	debug:true
}));

app.use(express.static(__dirname + '/public'));

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
