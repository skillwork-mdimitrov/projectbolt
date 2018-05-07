/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* LEGEND, COMMENTS
   ============================================================== */
// HC = Hard coded
// PtS = Problems to solve

/* VARIABLES
   ============================================================== */
var http = require('http');
// const url = require('url'); // maybe delete
var fs = require('fs'); // file system
let database = require('./scripts/sqltest/sqltest');
// =====================================================================================================================

/* SERVER
   ============================================================== */
var server = http.createServer(function (request, response) {
  "use strict";
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

  /* SCRIPT HANDLING
   ============================================================== */

  // Serve the main script on initial page load
  if(request.url.endsWith("mainScript.js")) {
    let fileToBeRead = "./scripts/mainScript.js";

    // Serve the request, return a response and close the request
    fs.readFile(fileToBeRead, function(err, data) {
      if(err instanceof Error){
        console.log(err + " _Main script failed to load");
      }
      response.writeHead(200, {'Content-Type': 'application/javascript'});
      response.write(data);
      response.end();
    });
  }

  // Serve the string comparison algorithm on page load
  if(request.url.endsWith("stringCompare.js")) {
    let fileToBeRead = "./scripts/stringCompare.js";

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

  // Handle the search for questions request
  if(request.url.endsWith("dynamic_request_fetchDB")) {
    let toWrite = "";
    database.queryDatabase(); // select every question from the database and store it in dbResults array
    database.dataLoading.then(function(resolve) {
      toWrite = resolve.join(); // since response needs to return a string, join() the results
      response.writeHead(200, {'Content-Type': 'application/javascript'});
      response.write(toWrite);
      response.end();
    })
    .catch(function (error) {
      console.log("Empty rows returned from queryDatabase. Error " + error.message);
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
    });
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