var Scriptr = function () {
	//~ this.socket = new ScriptrSocket('127.0.0.1', '3555');
	this.socket = new ScriptrSocket('djmorrsee.me', '3555');
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
	
	this.socket.SendMessage(changes.range[0], changes.additive, changes.range[1] - changes.range[0] + 1, changes.chars, hash);
	
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
		if(data.RESET === true) {
			scriptr.textBox.val(data.buffer)
			scriptr.textBoxValue = data.buffer
			return;
		}
		
		var current = scriptr.textBoxValue = scriptr.textBox.val();

		console.log(data)
				
		if (data.additive) {
			scriptr.textBox.val(current.slice(0, data.position) + data.chars + current.slice(data.position))
		} else {
			scriptr.textBox.val(current.slice(0, data.position) + current.slice(data.position + data.count))
		}	
		scriptr.textBoxValue = scriptr.textBox.val()
		
	};
	
});

$(window).unload(function (event) {
	scriptr.socket.CloseSocket();
});
