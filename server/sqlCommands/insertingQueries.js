/* JSHint quality control options
   ============================================================== */
/*jslint devel: true*/
/*jshint esversion: 6*/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config = require('./dbConfig').config;

// Promise
var outsideResolve; // will become dataLoading's Promise.resolve
var outsideReject; // will become dataLoading's Promise.reject
var insertion; // will be the Promise that will tell you if the insertion was successful or not

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("insertingQueries script successfully connected to the database!");
  }
});

function insertStatement(theSqlstatement) {
  // Every time this method is called, make a new promise
  insertion = new Promise(function(resolve, reject) {
    "use strict";
    outsideResolve = resolve;
    outsideReject = reject;
  });

  // And export this new promise
  module.exports.insertion = insertion;

  // Specify request
  request = new Request(
      theSqlstatement, // INSERT INTO etc
      // Can't scrap the below function, because Request expects another parameter
      function(err, rowCount, rows) {
        // process.exit();
      }
  );

  // Execute this request
  connection.execSql(request);

  // When the SQL execution is done, based on the result either fulfil the promise or reject it
  request.on('doneInProc', function (rowCount, more, rows) {
    // If affected rows are more than 0, operation was a success
    if(rowCount > 0) {
      outsideResolve("Insertion successful");
    }
    // If not, operation didn't affect any rows, it didn't go through
    else {
      outsideReject(new Error("Insertion didn't go through, 0 affected rows "));
    }
  });
}

// Make publicly available
module.exports.insertStatement = insertStatement;
