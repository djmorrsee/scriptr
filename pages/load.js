var RouteLoad = function(request, response) {
  // Check if DocServer w/ key is running, if so serve that
  // Check if we have a saved doc w/ key, if so serve that
  // Redirect to New

  console.log(request)
  response.send(request.params);
  response.end();
};

module.exports = RouteLoad;
