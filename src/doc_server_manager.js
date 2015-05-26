var doc_server = require('./doc_server')

var DocServerManager = function () {
  this.servers = new Object();

};

DocServerManager.prototype.GetActivePorts = function () {
  return Object.keys(this.servers)
};

DocServerManager.prototype.CreateServer = function () {
  var port = Math.floor(Math.random() * (99999-1000)) + 1000;
  this.LoadServer(port);
  return port;
};

DocServerManager.prototype.LoadServer = function (port) {
  if (!this.servers.port) {
    this.servers[port] = doc_server(port);
  }
};

DocServerManager.prototype.CloseServer = function (port) {
  if(this.servers.port) {
    this.servers.port.StopServer()
    delete this.servers.port
  }
};
module.exports = DocServerManager
