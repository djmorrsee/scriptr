function DocumentServer (_port) {
	var doc = require('./doc_manager.js')
	var wss = require('ws').Server
	
	var connections = [];
	
	var document = this.document = new doc();
	
	this.doc_server = new wss({port:_port});
	
	this.doc_server.on('connection', function (socket) {
		
		// Sync Current Buffer (will need to special case this)
		var obj = new Object();
		obj.RESET = true;
		obj.buffer = document.GetBufferAsString();
		socket.send(JSON.stringify(obj));
	
		// Add New Connection
		connections.push(socket);
		
		// Remove Socket from Connections
		socket.on('close', function () {
			connections = connections.filter(function (conn) {
				return conn != socket
			});
		});
		
		// Received Message From a Client
		socket.on('message', function (message) {
			var obj = JSON.parse(message);
			
			if(obj.additive) {
				document.AddChars(obj.position, obj.chars);
				console.log(document.GetBufferAsString());
			} else {
				document.RemoveChars(obj.position, obj.count);
				console.log(document.GetBufferAsString());
			}
			
			// Check hash
			require('assert').equal(document.HashBuffer(), obj.hash);
			
			// Broadcast
			connections.forEach(function(conn) {
				if (conn != socket) 
					conn.send(message);
			});
		});
	});	
}

DocumentServer.prototype.StopServer = function () {
	this.doc_server.close();
}

module.exports = DocumentServer
