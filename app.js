var fs = require ('fs');
var path = require('path');

var sass_middleware = require('node-sass-middleware')

var routeRoot = require('./pages/root.js');
var routeLoad = require('./pages/load.js');

var doc_server = require('./src/doc_server.js')(3555); // Initializes Server

var server_manager = require('./src/doc_server_manager.js')()

console.log(server_manager);


var express = require('express');
var app = express();

// Public Folder
app.use(express.static(__dirname + '/public'));

// Express Middleware
app.use(sass_middleware({
	src:__dirname+'/public',
	dest:__dirname+'/public',
	debug:true
}));


// Routing
app.get('', routeRoot);
app.get('/:key', routeLoad);


// Program Start
var http_server = app.listen(3000, function () {
	console.log('Listening...');
});


// Program Exit
process.on('exit', function () {
	console.log('close from exit')
	console.log(doc_server.document.buffer.join(''))
	doc_server.doc_server.close()

}).on('SIGINT', function () {
	console.log('SIGINT')
	process.exit()
});
