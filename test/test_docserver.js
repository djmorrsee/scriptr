var assert = require('assert');
var path = require('path')

var DocumentServer = require('../src/documentserver.js');

describe('DocumentServer', function () {
	it('Should start a WSS instance on initialization', function () {
		var ds = new DocumentServer(3555);
		ds.StopServer();
	});
});
