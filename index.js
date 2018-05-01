/* LEGEND, COMMENTS
   ============================================================== */
// HC = Hard coded

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
      if(err instanceof Error){
        console.log(err + " _HTML failed to load");
      }
      response.writeHead(200, {'Content-type': 'text/html'});
      response.write(data);
      response.end();
    });
  }
  // Handle scripts
  if(request.url.includes("/scripts/")) {
    let fileToBeRead = ""; // depending on the URL specify the file that needs to be read
    // Request is for the main page script (event listeners, etc.)
    if(request.url.endsWith("mainScript.js")) {
      fileToBeRead = "./scripts/mainScript.js"; // HC
    }
    // Request is for the script that will pull information from the Azure DB
    else if(request.url.endsWith("sqltest.js")) {
      fileToBeRead = "./scripts/sqltest/sqltest.js"; // HC
    }
    // Serve the request, return a response and close the request
    fs.readFile(fileToBeRead, function(err, data) {
      if(err instanceof Error){
        console.log(err + " _Scripts failed to load");
      }
      response.writeHead(200, {'Content-Type': 'application/javascript'});
      response.write(data);
      response.end();
    });
  }
  // Handle images
  if(request.url.includes("/images/")) {
    let fileToBeRead = ""; // depending on the URL specify the file that needs to be read
    let fileType = ""; // depending on the URL specify the file type to be read as
    if(request.url.endsWith("thunder.png")) {
      fileToBeRead = "./images/thunder.png"; // HC
      fileType = "png";
    }
    else if(request.url.endsWith("magnifyingGlass.png")) {
      fileToBeRead = "./images/magnifyingGlass.png"; // HC
      fileType = "png";
    }
    fs.readFile(fileToBeRead, function(err, data) {
      if(err instanceof Error){
        console.log(err + " _Images failed to load");
      }
      response.writeHead(200, {'Content-Type': 'image/' + fileType});
      response.write(data);
      response.end();
    });
  }
  // Handle CSS
  if(request.url.endsWith("/styles/style_index.css")) {
    fs.readFile("./styles/style_index.css", function(err, data) {
      if(err instanceof Error){
        console.log(err + " _Loading styles failed");
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