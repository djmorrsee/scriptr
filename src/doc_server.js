function DocumentServer (_port) {
	var doc = require('./doc_manager.js')
	var wss = require('ws').Server
	
	var connections = [];
	
	var document = this.document = new doc();
	
	this.doc_server = new wss({port:_port});
	
	this.doc_server.on('connection', function (socket) {
		socket.send(document.GetBufferAsString());
		
		socket.on('message', function (message) {
			
			var obj = JSON.parse(message);
			
			if(obj.additive) {
				document.AddChars(obj.position, obj.chars);
				console.log(document.GetBufferAsString());
			} else {
				document.RemoveChars(obj.position, obj.count);
				console.log(document.GetBufferAsString());
			}
		});
	});	
}

DocumentServer.prototype.StopServer = function () {
	this.doc_server.close();
}

module.exports = DocumentServer
