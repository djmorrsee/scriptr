var Scriptr = function () {
	this.socket = new ScriptrSocket('127.0.0.1', '3555');
	//~ this.socket = new ScriptrSocket('djmorrsee.me', '3555');
	this.doc
}

var scriptr = new Scriptr()
$(document).ready (function () {

	// Helper Function for Linking Socket and Document
	var SendEdit = function(changes) {
		if (changes) {
			var hash = XXH(scriptr.doc.textBoxValue, 0xABCD).toString(16);
			scriptr.socket.SendEditMessage(changes.range[0], changes.additive, changes.range[1] - changes.range[0] + 1, changes.chars, hash);
		}
	};

	// Helper Callback
	scriptr.doc = new ScriptrDocument(SendEdit);

	// Parse Messages from Server
	scriptr.socket.socket.onmessage = function (message) {
		var data = JSON.parse(message.data)

		switch(data.type) {
		case 0: // Sync
			scriptr.doc.SetText(data.body)
			break;
		case 1: // Edit
			var current = scriptr.doc.textBoxValue = scriptr.doc.textBox.val();
			var new_text
			if (data.body.additive) {
				new_text = current.slice(0, data.body.position) + data.body.chars + current.slice(data.body.position)
			} else {
				new_text = current.slice(0, data.body.position) + current.slice(data.body.position + data.body.count)
			}

			scriptr.doc.SetText(new_text);
			break;
		case 2: // Chat
			break;

		}
	};
});

// Close Socket on Unload
$(window).unload(function (event) {
	scriptr.socket.CloseSocket();
});
