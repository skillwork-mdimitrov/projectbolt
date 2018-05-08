/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config = require('./dbConfig').config;
var dbResults = []; // will store the results from the queries

// Promise
var outsideResolve; // will become dataLoading's Promise.resolve
var outsideReject; // will become dataLoading's Promise.reject
var dataLoading = new Promise(function(resolve, reject) {
  "use strict";
  outsideResolve = resolve;
  outsideReject = reject;
});

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Successfully connected to the database!");
 }
});

function getResultsAsArray(sqlstatement) {
  // Specify request
  request = new Request(
      sqlstatement,
      // Can't scrap the below function, because Request expects another parameter
      function(err, rowCount, rows) {
        // process.exit();
      }
  );

  // For each row get the column value and store it in an array
  request.on('row', function(columns) {
    columns.forEach(function(column) {
      // Push each result into the dbResults array
      dbResults.push(column.value);
    });
  });

  // Execute this request
  connection.execSql(request);

  // Completion status of the SQL statement execution
  request.on("doneInProc", function (rowCount) {
    if(rowCount > 0) {
      outsideResolve(dbResults);
      // fulfill the promise. This will trigger the promise .then() event.
      // The promise will return the dbResults, since it was passed as a parameter.
    }
    else {
      outsideReject(new Error("Empty results"));
    }
  });
}

// If getResultsAsArray doesn't fit your requirements, make another function below and export it

// Make publicly available
module.exports.getResultsAsArray = getResultsAsArray;
module.exports.dataLoading = dataLoading;