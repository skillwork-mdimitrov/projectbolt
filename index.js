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
  try {
    if(request.url === "/") {
      fs.readFile('index.html', function(err, data) {
        if(err instanceof Error){
          console.log(err + " HTML failed to load");
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        try {
          response.write(data);
        }
        catch (e) {
          response.write("Couldn't read HTML, so get this text instead" + e);
        }
        response.end();
      });
    }
  }
  catch (e) {
    console.log("CANT READ THIS INDEX HTML");
  }
  try {
    // Handle scripts
    if(request.url === "/mainScript.js") {
      fs.readFile('mainScript.js', function(err, data) {
        if(err instanceof Error){
          console.log(err + " Scripts failed to load");
        }
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        try {
          response.write(data);
        }
        catch (e) {
          response.write("Couldn't read SCRIPT, so get this text instead" + e);
        }
        response.end();
      });
    }
  }
  catch (e) {
    console.log("Scripts can't load" + e);
  }
    // Handle images
  try {
    if(request.url === "/images/thunder.png") {
      fs.readFile('images/thunder.png', function(err, data) {
        if(err instanceof Error){
          console.log(err + " Images failed to load");
        }
          response.writeHead(200, {'Content-Type': 'image/png'});
        try {
          response.write(data);
        }
        catch (e) {
          response.write("Couldn't read IMAGES, so get this text instead" + e);
        }
          response.end();
      });
    }
  }
  catch (e) {
    console.log("Images can't load" + e)
  }
    // Handle CSS
  try {
    if(request.url === "/styles/style_index.css") {
      fs.readFile("styles/style_index.css", function(err, data) {
        if(err instanceof Error){
          console.log(err + " Loading styles failed");
        }
        response.writeHead(200, {'Content-Type': 'text/css'});
        try {
          response.write(data);
        }
        catch (e) {
          response.write("Couldn't read HTML, so get this text instead" + e);
        }
        response.end();
      })
    }
  }
  catch (e) {
    console.log("Styles can't load" + e);
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