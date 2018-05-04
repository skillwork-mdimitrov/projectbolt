/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var dbResults = []; // will store the results from the queries

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
  // console.log('Reading rows from the Table...');

  // Read all rows from table
  request = new Request(
      "SELECT * FROM questions",
      // Can't scrap this, because Request expects another parameter
      function(err, rowCount, rows) {
        // console.log(rowCount + ' row(s) returned');
        // process.exit();
      }
  );

  request.on('row', function(columns) {
    columns.forEach(function(column) {
      // console.log("%s\t%s", column.metadata.colName, column.value);
      // Push each result into the dbResults array
      dbResults.push(column.value + "\n");
    });
  });

  connection.execSql(request);
}

// Make publicly available
module.exports.queryDatabase = queryDatabase;
module.exports.dbResults = dbResults;