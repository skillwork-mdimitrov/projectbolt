/* VARIABLES
   ============================================================== */
var http = require('http');
const url = require('url');
var fs = require('fs'); // file system
path = require('path');
filePath = path.join(__dirname, 'index.html');
// =====================================================================================================================

/* SERVER
   ============================================================== */
var server = http.createServer(function (request, response) {
  // Handle HTML
  if(request.url.endsWith("/")) {
    fs.readFile(filePath, function(err, data) {
      if(err instanceof Error){
        console.log(err + " HTML failed to load");
      }
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data.toString());
      response.end();
    });
  }
  try {
  // Handle scripts
  if(request.url.endsWith("/mainScript.js")) {
    fs.readFile('./mainScript.js', function(err, data) {
      if(err instanceof Error){
        console.log(err + " Scripts failed to load");
      }
      response.writeHead(200, {'Content-Type': 'application/javascript'});
      response.write(data.toString());
      response.end();
    });
  }
  // Handle images
  if(request.url.endsWith("/images/thunder.png")) {
    fs.readFile('./images/thunder.png', function(err, data) {
      if(err instanceof Error){
        console.log(err + " Images failed to load");
      }
      response.writeHead(200, {'Content-Type': 'image/png'});
      response.write(data.toString());
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
      response.write(data.toString());
      response.end();
    })
  }
  }
  catch (e) {
    console.log("Can't load the rest");
  }
});
// =====================================================================================================================

/* PORT
   ============================================================== */
// Specify port
var port = process.env.PORT || 443;
// Listen to port
server.listen(port);
// =====================================================================================================================

console.log("Server running at http://localhost:%d", port);