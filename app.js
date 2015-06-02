var fs = require ('fs');
var path = require('path');

var sass_middleware = require('node-sass-middleware')
var mustache_middleware = require('mustache-express')

var server_manager = new (require('./src/doc_server_manager.js'))()

var express = require('express');
var app = express();

var listen_port = 80; // 80 for prod, 3000 for test

// Express Middleware
app.use(sass_middleware({
	src:__dirname+'/public',
	dest:__dirname+'/public',
	debug:true
}));

app.engine('html', mustache_middleware());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/html');

// Public Folder
app.use(express.static(__dirname + '/public'));

// Routing
app.get('/', function(req, res) {
	var port = server_manager.CreateServer();
	res.render('index', {document_port:port})
});

app.get('/:key', function(req, res) {
	var key = req.params.key
	if (key === 'favicon.ico') {
		res.end()
		return;
	}
	var active_ports = server_manager.GetActivePorts();

	if (active_ports.indexOf(key) < 0) {
		server_manager.LoadServer(key);
	}

	res.render('index', { document_port:key })
});

// Program Start
var http_server = app.listen(listen_port, function () {
	console.log('Listening...');
});

// Program Exit
process.on('exit', function () {
	console.log('close from exit')

}).on('SIGINT', function () {
	console.log('SIGINT')
	process.exit()
});
