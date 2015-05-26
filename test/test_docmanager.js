var assert = require('assert');
var path = require('path')

var DocumentBuffer = require('../src/doc_manager.js');


describe('DocumentBuffer', function () {

	// Initialization Test
	it('should have an empty buffer at creation', function () {
		var db = new DocumentBuffer();
		assert.equal(db.buffer.length, 0);
	});

	// Valid Buffer Contents Test
	describe('#_ValidChar', function () {
		it('should return true when given a printable character', function () {
			// Test ASCII code 32-126
			var db = new DocumentBuffer();

			for (var i = 32; i <= 126; ++i) {
				var ch = String.fromCharCode(i);
				assert.equal(db._ValidChar(ch), 1);
			}
		});

		it('should return false when given a non-printable character', function () {
			// Test ASCII code 0-31, 127-...
			var db = new DocumentBuffer();

			for (var i = 0; i < 32; ++i) {
				if (i === 10 || i === 9) // Accepts tabs and spaces
					continue

				var ch = String.fromCharCode(i);
				assert.equal(db._ValidChar(ch), 0);
			}

		});

	});

	// Insertion Tests
	describe('#AddChars', function () {
		it('should allow insertion of a char at any index', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'a');
			assert.deepEqual(db.buffer, ['a']);

			db.AddChars(0, 'b');
			assert.deepEqual(db.buffer, ['b', 'a']);

			db.AddChars(1, 'c');
			assert.deepEqual(db.buffer, ['b', 'c', 'a']);

			db.AddChars(3, 'd');
			assert.deepEqual(db.buffer, ['b', 'c', 'a', 'd']);
		});

		it('should throw an error if trying to insert non-printable characters', function () {
			var db = new DocumentBuffer();
			assert.throws(function () { db.AddChars(0, String.fromCharCode(1)) }, Error);
		});

		it('should insert at the end for indexes > length', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'a');
			assert.deepEqual(db.buffer, ['a']);

			db.AddChars(1200, 'b');
			assert.deepEqual(db.buffer, ['a', 'b']);
		});

		it('should insert at the beginning for indexes < 0', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'a');
			assert.deepEqual(db.buffer, ['a']);

			db.AddChars(-1200, 'b');
			assert.deepEqual(db.buffer, ['b', 'a']);

		});

		it('should allow the insertion of a range of characters', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'a');
			assert.deepEqual(db.buffer, ['a']);

			db.AddChars(-500, 'bad');
			assert.deepEqual(db.buffer, ['b', 'a', 'd', 'a']);

			db.AddChars(2, 'xyz');
			assert.deepEqual(db.buffer, ['b', 'a', 'x', 'y', 'z', 'd', 'a']);

		});
	});

	describe('#RemoveChars', function () {
		it('should remove a chunk of characters from the buffer, given by a starting index and a count', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'abcd');
			db.RemoveChars(1, 1);

			assert.deepEqual(db.buffer, ['a', 'c', 'd']);

			db.RemoveChars(0, 1000);
			assert.deepEqual(db.buffer, []);
		});

		it('should do nothing if remove count is 0', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'abc');
			db.RemoveChars(1, 0);

			assert.deepEqual(db.buffer, ['a', 'b', 'c']);
		});

		it('should normalize indeces out of range of the buffer', function () {
			var db = new DocumentBuffer();

			db.AddChars(0, 'abc');
			assert.deepEqual(db.buffer, ['a', 'b', 'c']);

			db.RemoveChars(-500, 2);
			assert.deepEqual(db.buffer, ['c']);
		});
	});

	describe('#HashBuffer', function () {
		it('should hash the entire buffer and return it, using md5', function () {
			var db = new DocumentBuffer();
			assert.equal(db.HashBuffer(), db.HashBuffer());
		});

		it('should always have a different hash for different buffers', function () {
			// This is a limit of md5, in practice we will never have a collision
			var db = new DocumentBuffer();

			var old_hash = db.HashBuffer();
			db.AddChars(0, 'abcd');

			assert.notEqual(old_hash, db.HashBuffer());

		});
	});
});
