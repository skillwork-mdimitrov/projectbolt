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
var insertion = new Promise(function(resolve, reject) {
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
    console.log("insertingQueries script successfully connected to the database!");
  }
});

function insertStatement(theSqlstatement) {
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

  /* Promise will give you positive results if the first time it successfully passes. If you then
     spam the same query (without restarting the server that is) it won't go in the Azure DB, but the promise will still
     say it successfully inserted. Limit this behaviour in the front-end, if you can't let me know I can try
     reevaluation the promise somehow */
  request.on('doneInProc', function (rowCount, more, rows) {
    if(rowCount > 0) {
      outsideResolve("Insertion successful"); //
    }
    else {
      outsideReject(new Error("Insertion didn't go through, 0 affected rows "));
    }
  });
}

// Make publicly available
module.exports.insertStatement = insertStatement;
module.exports.insertion = insertion;