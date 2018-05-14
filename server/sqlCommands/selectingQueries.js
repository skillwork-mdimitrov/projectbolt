/* JSHint quality control options
   ============================================================== */
/*jslint devel: true*/
/*jshint esversion: 6*/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config = require('./dbConfig').config;
var dbResults = []; // will store the results from the queries
let dbResultsJSON = {}; // will store the results from the queries in JSON format

// Promise
var outsideResolve; // will become dataLoading's Promise.resolve
var outsideReject; // will become dataLoading's Promise.reject
var dataLoading; // will be the Promise that will tell you if the selection was successful or not

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("selectingQueries script successfully connected to the database!");
 }
});

// The request will hang, if you give incorrect table/column name
function getResultsAsArray(sqlstatement) {
  dbResults.length = 0; // clear the currently stored dbResults, so on new request they can be added again

  // Every time this method is called, make a new promise
  dataLoading = new Promise(function(resolve, reject) {
    "use strict";
    outsideResolve = resolve;
    outsideReject = reject;
  });

  // Export this new promise every time you make a new one
  module.exports.dataLoading = dataLoading;

  // Specify request
  request = new Request(
      sqlstatement, // SELECT * etc
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

  // Completion status of the SQL statement execution.
  request.on("doneInProc", function (rowCount) {
    if(rowCount > 0) {
      // fulfill the promise. This will trigger the promise .then() event.
      // The promise will return the dbResults, since it was passed as a parameter.
      outsideResolve(dbResults);
    }
    else {
      outsideReject(new Error("Empty results"));
    }
  });
}

// THIS IS SPECIFIC TO QUESTIONS AND THEIR ID, will change name later
function getResultsAsJSON(sqlstatement) {
  // dbResultsJSON = {}; // Make better

  // Every time this method is called, make a new promise
  dataLoading = new Promise(function(resolve, reject) {
    "use strict";
    outsideResolve = resolve;
    outsideReject = reject;
  });

  // Export this new promise every time you make a new one
  module.exports.dataLoading = dataLoading;

  // Specify request
  request = new Request(
      sqlstatement, // SELECT * etc
      // Can't scrap the below function, because Request expects another parameter
      function(err, rowCount, rows) {
        // process.exit();
      }
  );

  request.on('row', function(columns) {
    // let uniqueIdentifier = columns[0].value; // the first's column value (the id of the question)
    // dbResultsJSON[uniqueIdentifier] = {};
    // columns.forEach(function(column) {
    //   if(column.metadata.colName === 'id') {
    //     dbResultsJSON[uniqueIdentifier].id = column.value;
    //   }
    //   if(column.metadata.colName === 'question') {
    //     dbResultsJSON[uniqueIdentifier].question = column.value;
    //   }
    // });
    // let count = 0;
    // dbResultsJSON[count] = {};
    columns.forEach(function(column) {
      var colName = column.metadata.colName;
      dbResultsJSON.push({colName: column.value});
    });
  });

  // Execute this request
  connection.execSql(request);

  // Completion status of the SQL statement execution.
  request.on("doneInProc", function (rowCount) {
    if(rowCount > 0) {
      outsideResolve(dbResultsJSON);
    }
    else {
      outsideReject(new Error("Empty results"));
    }
  });
}

// If getResultsAsArray doesn't fit your requirements, make another function below and export it

// Make publicly available
module.exports.getResultsAsArray = getResultsAsArray;
module.exports.getResultsAsJSON = getResultsAsJSON;