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
    if(request.url === "/") {
      fs.readFile('index.html', function(err, data) {
        if(err instanceof Error){
          console.log(err + " HTML failed to load");
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        if(typeof data === 'undefined' || data === null) {
          response.write(data.toString());
        }
        else {
          response.write("Couldn't read HTML, so get this text instead");
        }
        response.end();
      });
    }
    // Handle scripts
    if(request.url === "/mainScript.js") {
      fs.readFile('mainScript.js', function(err, data) {
        if(err instanceof Error){
          console.log(err + " Scripts failed to load");
        }
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        if(typeof data === 'undefined' || data === null) {
          response.write(data.toString());
        }
        else {
          response.write("Couldn't read Script, so get this text instead");
        }
        response.end();
      });
    }
    // Handle images
    if(request.url === "/images/thunder.png") {
      fs.readFile('images/thunder.png', function(err, data) {
        if(err instanceof Error){
          console.log(err + " Images failed to load");
        }
          response.writeHead(200, {'Content-Type': 'image/png'});
        if(typeof data === 'undefined' || data === null) {
          response.write(data.toString());
        }
        else {
          response.write("Couldn't read Images, so get this text instead");
        }
          response.end();
      });
    }
    // Handle CSS
    if(request.url === "/styles/style_index.css") {
      fs.readFile("styles/style_index.css", function(err, data) {
        if(err instanceof Error){
          console.log(err + " Loading styles failed");
        }
        response.writeHead(200, {'Content-Type': 'text/css'});
        if(typeof data === 'undefined' || data === null) {
          response.write(data.toString());
        }
        else {
          response.write("Couldn't read CSS, so get this text instead");
        }
        response.end();
      })
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