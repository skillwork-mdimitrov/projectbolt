/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var dbResults = []; // will store the results from the queries

var outsideResolve;
var outsideReject;
var promise = new Promise(function(resolve, reject) {
  outsideResolve = resolve;
  outsideReject = reject;
});


var config = {
  userName: 'pbadmin',
  password: '56(E+!,?NGQ85tY"a%l#%5IU~[J>GU',
  server: 'projectbolt.database.windows.net',
  options: {
    database: 'ProjectBolt',
    encrypt: true
  }
};

var connection = new Connection(config);

// On connect, not needed for now
// Attempt to connect and execute queries if connection goes through
// connection.on('connect', function(err) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     queryDatabase();
//  }
// });

function queryDatabase() {
  dbResults.length = 0; // clear the array from previous results, before populating it again

  // Read all rows from table
  request = new Request(
      "SELECT question FROM questions",
      // Can't scrap the below function, because Request expects another parameter
      function(err, rowCount, rows) {
        numRows = rowCount; // not async ...
        // process.exit();
      }
  );

  /* TODO: Will try here to make a promise that if(request.row.next() === null) resolve the promise with the dbResults
  , so in the node file, .then(write(data)) won't have to do the hacky async
  Find out how to check which element of the foreach is the last one, so I can then resolve the promise */
  request.on('row', function(columns) {
    columns.forEach(function(column) {
      // Push each result into the dbResults array
      dbResults.push(column.value);
    });
  });

  request.on("doneInProc", function (rowCount, more) {
    outsideResolve(dbResults);
  });

  connection.execSql(request);
}

// Make publicly available
module.exports.queryDatabase = queryDatabase;
module.exports.promise = promise;