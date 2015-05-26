var assert = require('assert');
var path = require('path')

var DocumentServerManager = require('../src/doc_server_manager.js');

describe('DocumentServerManager', function () {
  var dsm

  beforeEach(function () {
    dsm = new DocumentServerManager();
  })


  describe('#GetActivePorts', function () {
    it('should return a list of the currently active ports', function () {
      dsm.LoadServer(2222)
      dsm.LoadServer(1234)
      assert.deepEqual(['2222', '1234'].sort(), dsm.GetActivePorts().sort())
    })
    it('should be an empty list on init', function () {
      assert.equal(dsm.GetActivePorts().length, 0)
    })
  });
  describe('#CreateServer', function () {
    it('should allow creating a server on a random port', function () {
      dsm.CreateServer();
      assert.equal(dsm.GetActivePorts().length, 1)
    });
    it('should return the new servers port', function () {
      var port = dsm.CreateServer();
      assert.equal(port, dsm.GetActivePorts()[0])
    });
  });
  describe('#LoadServer', function () {
    it('should allow creating a server on a specific port', function () {
      dsm.LoadServer(2222)
      assert.equal(2222, dsm.GetActivePorts()[0])
    });
    it('should do nothing if the specific port already exists', function () {
      dsm.LoadServer(2222)
      var pre = dsm
      dsm.LoadServer(2222)
      assert.equal(pre, dsm)
    });
  });
});
