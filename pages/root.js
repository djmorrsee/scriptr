

var RouteRoot = function (request, response) {
  // Spin New DocServer
  // Serve Index w/ New Port Number
  route.sendfile('index.html')
  route.end();
}
module.exports = RouteRoot
