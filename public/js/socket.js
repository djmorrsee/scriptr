var ScriptrSocket = function (host, port) {
	this.socket = new WebSocket('ws://' + host + ':' + port);
	
	this.socket.onopen = function () {
		console.log('connected');
	};
	
	
};

ScriptrSocket.prototype.SendMessage = function(position, additive, count, chars, hash) {
	if (chars.length !== count) {
		console.log(count)
		return
	}

	var obj = new Object();
	
	obj.position = position;
	obj.additive = additive > 0 ? 1 : 0;
	obj.count = count;
	obj.chars = chars;
	obj.hash = hash;
	
	this.socket.send(JSON.stringify(obj));

};

ScriptrSocket.prototype.CloseSocket = function () {
	this.socket.close(1000);
}

