var socket = new WebSocket('ws://127.0.0.1:3555');

socket.onopen = function () {
	socket.send("ACK");
};

socket.onmessage = function (message) {
	console.log(message);
};

function SendMessage(position, additive, count, chars, hash) {
	
	if (chars.length !== count) {
		return 'err'
	}
	
	var obj = new Object();
	
	obj.position = position;
	obj.additive = additive > 0 ? 1 : 0;
	obj.count = count;
	obj.chars = chars;
	obj.hash = hash;
	
	socket.send(JSON.stringify(obj));
}

function CloseSocket() {
	socket.close(1000);
}

$(window).unload(function(event) {
	SendMessage(0, 1, 1, 'a');
	CloseSocket();
});
