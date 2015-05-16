function DocumentServer (_port) {

	var wss = require('ws').Server
	this.doc_server = new wss({port:_port});
	
	this.doc_server.on('connection', function (socket) {
		socket.write('hello from server');
		socket.on('message', function (message) {
			socket.write('you wrote ' + message);
		});
	});
	
}

DocumentServer.prototype.StopServer = function () {
	this.doc_server.close();
}

module.exports = DocumentServer
