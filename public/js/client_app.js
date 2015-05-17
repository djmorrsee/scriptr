var Scriptr = function () {
	this.socket = new ScriptrSocket('127.0.0.1', '3555');
	//~ this.socket = new ScriptrSocket('djmorrsee.me', '3555');
	this.textBox;
	this.textBoxValue;
}

Scriptr.prototype.TextChanged = function () {
	
	var new_val = this.textBox.val();
	if(new_val === this.textBoxValue)
		return;
	
	var changes = FindChanges(this.textBoxValue, new_val);
	this.textBoxValue = new_val;
	
	var hash = XXH(this.textBoxValue, 0xABCD).toString(16);
	
	this.socket.SendEditMessage(changes.range[0], changes.additive, changes.range[1] - changes.range[0] + 1, changes.chars, hash);
	
};

Scriptr.prototype.ReceivedChange = function (message) {
	
};

var scriptr = new Scriptr()

$(document).ready (function () {
	
	// Assign TextBox and Store Value in Buffer
	scriptr.textBox = $(scriptBox);
	scriptr.textBoxValue = scriptr.textBox.val();
		
	// Set Text Change Callback
	scriptr.textBox.on('change keyup paste', function () {
		scriptr.TextChanged();
	});
	
	scriptr.socket.socket.onmessage = function (message) {
		var data = JSON.parse(message.data)

		switch(data.type) {
		case 0: // Sync
			scriptr.textBox.val(data.body);
			scriptr.textBoxValue = data.body;
			break;
		case 1: // Edit
			var current = scriptr.textBoxValue = scriptr.textBox.val();

			if (data.body.additive) {
				scriptr.textBox.val(current.slice(0, data.body.position) + data.body.chars + current.slice(data.body.position))
			} else {
				scriptr.textBox.val(current.slice(0, data.body.position) + current.slice(data.body.position + data.body.count))
			}
			scriptr.textBoxValue = scriptr.textBox.val()
			break;
		case 2: // Chat
			break;
			
		}
	};
});

$(window).unload(function (event) {
	scriptr.socket.CloseSocket();
});
