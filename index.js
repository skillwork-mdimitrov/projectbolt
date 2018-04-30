/* VARIABLES
   ============================================================== */
var http = require('http');
const url = require('url');
var fs = require('fs'); // file system
// =====================================================================================================================

/* SERVER
   ============================================================== */
var server = http.createServer(function (request, response) {
  // Handle HTML
  if(request.url.endsWith("/")) {
    fs.readFile("index.html", function (err, data) {
      response.writeHead(200, {'Content-type': 'text/html'});
      response.write(data);
      response.end();
    });
  }
  // Handle scripts
  if(request.url.endsWith("/mainScript.js")) {
    fs.readFile('./mainScript.js', function(err, data) {
      if(err instanceof Error){
        console.log(err + " Scripts failed to load");
      }
      response.writeHead(200, {'Content-Type': 'application/javascript'});
      response.write(data);
      response.end();
    });
  }
  // Handle images
  if(request.url.endsWith("/images/thunderBolt.ico")) {
    fs.readFile('./images/thunder.png', function(err, data) {
      if(err instanceof Error){
        console.log(err + " Images failed to load");
      }
      response.writeHead(200, {'Content-Type': 'image/x-icon'});
      response.write(data);
      response.end();
    });
  }
  // Handle CSS
  if(request.url.endsWith("/styles/style_index.css")) {
    fs.readFile("./styles/style_index.css", function(err, data) {
      if(err instanceof Error){
        console.log(err + " Loading styles failed");
      }
      response.writeHead(200, {'Content-Type': 'text/css'});
      response.write(data);
      response.end();
    })
  }
});
// =====================================================================================================================

/* PORT
   ============================================================== */
// Specify port
var port = process.env.PORT || 1337;
// Listen to port
server.listen(port);
// =====================================================================================================================

console.log("Server running at http://localhost:%d", port);