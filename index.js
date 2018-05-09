/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* LEGEND, COMMENTS
   ============================================================== */
// HC = Hard coded

/* VARIABLES
   ============================================================== */
let selectingQueries = require('./server/sqlCommands/selectingQueries');
let insertingQueries = require('./server/sqlCommands/insertingQueries');
const express = require('express');
const app = express();
// =====================================================================================================================

/* SERVER
   ============================================================== */
app.use(express.static('public')); // Will handle every static file placed in the public directory

app.get('/dynamic_request_fetchDB', function(request, response) {
  "use strict";
  let toWrite = "";
  selectingQueries.getResultsAsArray("SELECT question FROM questions"); // select every question from the database and store it in dbResults array
  selectingQueries.dataLoading.then(function(resolve) {
    toWrite = resolve.join(); // since response needs to return a string, join() the array results
    response.write(toWrite);
    response.end();
  })
  .catch(function (error) {
    console.log("Empty rows returned from getResultsAsArray. Error " + error.message);
  });
});

/* INSERTING INTO THE DB EXAMPLE METHOD
   ============================================================== */
/*
  // This will fail if what you try to INSERT already exists in the database
  insertingQueries.insertStatement("INSERT INTO questions (question) VALUES ('MyTeest')");
  insertingQueries.insertion.then(function(resolve) {
    console.log(resolve); // write this resolve back to the user, like response.write(resolve) maybe
  })
  .catch(function (error) {
    console.log("Insert failed - " + error.message); // re-write this in the response.write("Msg " + error)
  });
*/

app.get('/dynamic_request_writeToDB', function(request, response) {
  "use strict";
  let toWrite = request.data;
  response.write("whatever");
  response.end();
});

// =====================================================================================================================

/* PORT
   ============================================================== */
// Specify port
var port = process.env.PORT || 1337;
// Listen to port
app.listen(port, function() {
  "use strict";
  console.log("Server running at http://localhost:%d", port);
});
// =====================================================================================================================
