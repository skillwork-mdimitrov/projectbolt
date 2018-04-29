var http = require('http');
var fs = require('fs');
// var mainScript = require('./mainScript');

var server = http.createServer(function (request, response) {
  fs.readFile('index.html', function(err, data) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
  });
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
