function DocumentServer (_port) {
	var DocumentManager = require('./doc_manager.js')
	var wss = require('ws').Server
	
	var connections = [];
	
	this.document = new DocumentManager();
	
	var GetSyncBuffer = function () {
		var obj = new Object();
		obj.type = 0;
		obj.body = this.document.GetBufferAsString();
		return obj
	}
	
	var SyncBuffer = function (conn) {
		var sbuffer = GetSyncBuffer()
		conn.send(JSON.stringify(sbuffer))	
	}
	
	var SyncAllBuffers = function () {
		connections.forEach(function (conn) {
			SyncBuffer(conn)
		});
	}
	
	
	var HandleEditMessage = function(message, from_socket) {
		if(message.body.additive) {
			var success = document.AddChars(message.body.position, message.body.chars)
			if (!success) {
				// Error Adding (Bad Characters)
				console.log('desync');
				SyncAllBuffers();
				return;
			}
		} else {
			document.RemoveChars(message.body.position, message.body.count);
		}
			
		// Check hash
		if(document.HashBuffer() !== message.body.hash) {
			// Became Unsynced, Resync Everythings
			console.log('desync ' + message);
			SyncAllBuffers();
			return;
		}
		
		// Broadcast Edit Message To Other Connections
		connections.forEach(function(conn) {
			if (conn != from_socket) 
				conn.send(JSON.stringify(message));
		});
		
	};
	
	var HandleChatMessage = function(message) {
		
	};
	
	this.doc_server = new wss({port:_port});
	this.doc_server.on('connection', function (socket) {
		
		// Sync Current Buffer (will need to special case this)
		SyncBuffer(socket);
		
		// Add New Connection
		connections.push(socket);
		
		// Event: Closed - Remove Socket from Connections 
		socket.on('close', function () {
			connections = connections.filter(function (conn) {
				return conn != socket
			});
		});
		
		// Event: Received Message From a Client
		socket.on('message', function (message) {
			var obj = JSON.parse(message);
			var type = obj.type
			
			
			switch(type) {
			case 0: // Sync (should never receive)
				break;
			case 1: // Edit 
				HandleEditMessage(obj, socket)
				break;
			case 2: // Chat
				break;
			}
			
			
		});
	});	
}

DocumentServer.prototype.StopServer = function () {
	this.doc_server.close();
}

module.exports = DocumentServer
