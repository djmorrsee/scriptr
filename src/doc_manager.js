function DocumentBuffer () {
	this.buffer = this.LoadBufferFromFile('buffer-pers.txt');
	console.log(this.buffer)
}

DocumentBuffer.prototype.HashBuffer = function () {
	return require('xxhashjs')(this.buffer.join(''), 0xABCD).toString(16)
};

DocumentBuffer.prototype.AddChars = function (pos, chars) {
	var buff = this.buffer
	var vc = this._ValidChar
	
	var valid = chars.split('').map(function (val) {
		return vc(val)
	}).reduce(function (l, r) {
		return l || r;
	})
	
	if(!valid) {
		return false;
	}
	
	// Normalize to avoid negative range issues
	pos = pos < 0 ? 0 : pos;
	
	chars.split('').forEach(function(char) {
		buff.splice(pos++, 0, char);
	});
	return true;
};

DocumentBuffer.prototype.RemoveChars = function (start, count) {
	
	// Normalize for negative indeces
	start = start < 0 ? 0 : start;
	
	this.buffer = (this.buffer.slice(0, start).join('') + this.buffer.slice(start+count).join('')).split('');
};

DocumentBuffer.prototype._ValidChar = function (char) {
	var val = char.charCodeAt(0);
	return (32 <= val && val <= 126) || val == 10;
};

DocumentBuffer.prototype.SaveBufferToFile = function(filename) {
	var fs = require('fs')
	fs.writeFile(filename, this.GetBufferAsString(), function(err) {
		if(err) {
			console.log('Error writing to file ' + filename);
		}
	});
};

DocumentBuffer.prototype.LoadBufferFromFile = function(filename) {
	return [];
}

DocumentBuffer.prototype.GetBufferAsString = function () {
	if(this.buffer != null)
		return this.buffer.join('');
	else
		return ''
};

module.exports = DocumentBuffer
