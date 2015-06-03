function DocumentServer (_port) {

	// Closure around this
	var self = this;

	// Load The Document Manager and Server
	var DocumentManager = require('./doc_manager.js')
	var wss = require('ws').Server

	var connections = [];
	// var connections = new Object();

	// Check if we have a saved file with our port number and load it
	var filename = __dirname + '/../saved_buffers/' + _port
	if(!require('fs').existsSync(filename)) {
		this.document = new DocumentManager();
	} else {
		this.document = new DocumentManager(filename)
	}

	var GetSyncBufferMessage = function () {
		var obj = new Object();
		obj.type = 0;
		obj.body = this.document.GetBufferAsString();
		return obj
	}

	var SyncBuffer = function (conn) {
		var sbuffer = GetSyncBufferMessage()
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
		connections.forEach(function (conn) {
			conn.send(JSON.stringify(message))
		});
	};

	var HandleSaveMessage = function() {
		document.SaveBufferToFile(filename);
	}


	var HandleNewConnection = function(conn) {
		conn.on('message', function(message) {
			var parsed_message = JSON.parse(message);
			var message_type = parsed_message.type;

			switch (type) {
				case 0: // Initial Connection Message
					var user_name = parsed_message.body;
					SyncBuffer(conn);
					connections.user_name = socket;
					break;
				case 1: // Edit

					break;
				case 2: // Sync

					break;
				case 3: // Save

					break;
				case 4: // Name Change

					break;

				case 5: // End of Connection

					break;
				default:

			}
		})

		conn.on('close', function () {
			delete connections.user_name;
		})
	}

	self.doc_server = new wss({port:_port});
	self.doc_server.on('connection', function (socket) {
		console.log(socket._socket.remoteAddress);

		// Sync Current Buffer (will need to special case this)
		SyncBuffer(socket);

		// Add New Connection
		connections.push(socket);

		// Event: Closed - Remove Socket from Connections
		socket.on('close', function () {
			// Broadcast user disconnect


			// Remove from list of connections
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
				HandleChatMessage(obj)
				break;
			case 3: // Save Buffer
				HandleSaveMessage()
				break;
			}


		});
	});
	return this
}

DocumentServer.prototype.StopServer = function () {
	this.doc_server.close();
}

DocumentServer.prototype.PrintBuffer = function () {
	return this.doc_server.document.buffer.join('');
};

module.exports = DocumentServer
