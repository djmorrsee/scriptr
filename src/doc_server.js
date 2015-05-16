function DocumentServer (_port) {
	var doc = require('./doc_manager.js')
	var wss = require('ws').Server
	
	var connections = [];
	
	this.document = new doc();
	
	this.doc_server = new wss({port:_port});
	
	this.doc_server.on('connection', function (socket) {
		
		// Sync Current Buffer (will need to special case this)
		var reset = function (conn) {
			var obj = new Object();
			obj.RESET = true;
			obj.buffer = document.GetBufferAsString();
			
			conn.send(JSON.stringify(obj));
			
		}
		reset(socket);
		
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
				if (!document.AddChars(obj.position, obj.chars)) {
					// Error Adding (Bad Characters)
					console.log('desync');
					connections.forEach(function (conn) {
						reset(conn);
					});
					return;
				}
				//~ console.log(document.GetBufferAsString());
			} else {
				document.RemoveChars(obj.position, obj.count);
				//~ console.log(document.GetBufferAsString());
			}
			
			// Check hash
			if(document.HashBuffer() !== obj.hash) {
				// Became unsynced, the big cause of this is simultaneous edits travelling across the line
				console.log('desync');
				connections.forEach(function (conn) {
					reset(conn);
				});
				return;
			}
			
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
