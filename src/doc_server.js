function DocumentServer (_port) {

	// Closure around this
	var self = this;

	// Load The Document Manager and Server
	var DocumentManager = require('./doc_manager.js')
	var wss = require('ws').Server

	// Check if we have a saved file with our port number and load it
	var filename = __dirname + '/../saved_buffers/' + _port
	if(!require('fs').existsSync(filename)) {
		this.document = new DocumentManager();
	} else {
		this.document = new DocumentManager(filename)
	}

	// Generate Sync Message
	var GenerateSyncMessage = function () {
		var obj = new Object();
		obj.type = 0;
		obj.body = this.document.GetBufferAsString();
		return obj
	}

	var SyncBuffers = function () {
		var sbuffer = GenerateSyncMessage();
		connected_clients.forEach(function (conn) {
			conn.socket.send(JSON.stringify(sbuffer))
		});
	}

	var SyncClientNames = function () {
		connected_clients.forEach(function(conn) {

			var names = connected_clients.filter(function(e) { return true }).map(function(elem) { return elem.name }).sort()

			console.log(names);
			var obj = new Object();

			obj.type = 5;
			obj.body = names;

			conn.socket.send(JSON.stringify(obj));
		});
	}

	var HandleEditMessage = function(message, from_socket) {
		if(message.body.additive) {
			var success = document.AddChars(message.body.position, message.body.chars)
			if (!success) {
				// Error Adding (Bad Characters)
				console.log('desync');
				SyncBuffers();
				return;
			}
		} else {
			document.RemoveChars(message.body.position, message.body.count);
		}

		// Check hash
		if(document.HashBuffer() !== message.body.hash) {
			// Became Unsynced, Resync Everythings
			console.log('desync ' + message);
			SyncBuffers();
			return;
		}

		// Broadcast Edit Message To Other Connections
		connected_clients.forEach(function(conn) {
			if (conn.socket !== from_socket) {
				conn.socket.send(JSON.stringify(message));
			}
		});
	};

	var HandleChatMessage = function(message) {
		connected_clients.forEach(function (conn) {
			conn.socket.send(JSON.stringify(message))
		});
	};

	var HandleSaveMessage = function() {
		document.SaveBufferToFile(filename);
	}

	var connected_clients = {}
	var AddClient = function (name, socket) {
		var num_clients = connected_clients.length;
		
		connected_clients[name] = socket;
		SyncClientNames();
	}

	var RemoveClient = function(socket) {
		connected_clients = connected_clients.filter(function (ele) {
			ele.socket !== socket;
		})
	}

	var HandleNameChange = function (conn, message) {
		var user = connected_clients.filter(function(elem) { return elem.socket === conn })[0]
		user.name = message.body;

		SyncClientNames()

	}

	var CheckConnection = function (conn) {
		return connected_clients.filter(function(elem) { return elem.socket === conn }).length > 0;
	}

	var HandleNewConnection = function(conn) {

		conn.on('message', function(message) {
			var parsed_message = JSON.parse(message);
			var message_type = parsed_message.type;
			switch (message_type) {
				case 0: // Initial Connection Message
					var user_name = parsed_message.body;
					AddClient(user_name, conn);

					SyncBuffers(conn);
					SyncClientNames();
					break;
				case 1: // Edit
					if(CheckConnection(conn))
						HandleEditMessage(parsed_message, conn);
					break;
				case 2: // Chat
					if(CheckConnection(conn))
						HandleChatMessage(parsed_message)
					break;
				case 3: // Save
					if(CheckConnection(conn))
						HandleSaveMessage();
					break;
				case 4: // Name Change
					if(CheckConnection(conn))
						HandleNameChange(conn, parsed_message)
					break;

				case 5: // End of Connection

					break;
				default:

			}
		})

		conn.on('close', function () {
			RemoveClient(conn)
		});
	}

	self.doc_server = new wss({port:_port});
	self.doc_server.on('connection', HandleNewConnection);
	return this
}

DocumentServer.prototype.StopServer = function () {
	this.doc_server.close();
}

DocumentServer.prototype.PrintBuffer = function () {
	return this.doc_server.document.buffer.join('');
};

module.exports = DocumentServer
