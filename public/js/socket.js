var ScriptrSocket = function (host, port) {
	this.socket = new WebSocket('ws://' + host + ':' + port);

	this.socket.onopen = function () {
		// Send AK and username
		var obj = new Object();
		obj.type = 0;
		obj.body = $('#chat-name').val()
		this.send(JSON.stringify(obj));
	};
};

ScriptrSocket.prototype.SendChatMessage = function(user, message) {
	var body = new Object();
	body.user = user
	body.message = message

	var obj = new Object();

	obj.type = 2
	obj.body = body

	this.socket.send(JSON.stringify(obj));

};

ScriptrSocket.prototype.SendEditMessage = function(position, additive, count, chars, hash) {
	if (chars.length !== count) {
		console.log(count)
		return
	}

	var body = new Object();

	body.position = position;
	body.additive = additive > 0 ? 1 : 0;
	body.count = count;
	body.chars = chars;
	body.hash = hash;

	var obj = new Object();

	obj.type = 1
	obj.body = body

	this.socket.send(JSON.stringify(obj));

};

ScriptrSocket.prototype.SendSaveMessage = function () {
	// body...
	var obj = new Object();
	obj.type = 3; // Save
	obj.body = {};
	this.socket.send(JSON.stringify(obj));
};

ScriptrSocket.prototype.SendNameChange = function (new_name) {
	// body...
	var obj = new Object();
	obj.type = 4; // Name Change
	obj.body = new_name;
	this.socket.send(JSON.stringify(obj));
};

ScriptrSocket.prototype.CloseSocket = function () {
	this.socket.close(1000);
}
