var http = require('http');
const url = require('url');
var fs = require('fs');
// var mainScript = require('./mainScript');

var server = http.createServer(function (request, response) {
   // fs.readFile('index.html', function(err, data) {
    if(request.url === "/") {
      fs.readFile('index.html', function(err, data) {
        response.write(data);
        response.end();
      });
      response.writeHead(200, {'Content-Type': 'text/html'});
    }
    if(request.url === "/mainScript.js") {
      fs.readFile('mainScript.js', function(err, data) {
        response.write(data);
        response.end();
      });
      response.writeHead(200, {'Content-Type': 'application/javascript'});
    }
    if(request.url === "/images/thunder.png") {
      fs.readFile('images/thunder.png', function(err, data) {
        response.write(data);
        response.end();
      });
      response.writeHead(200, {'Content-Type': 'image/png'});
    }
   // });
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);