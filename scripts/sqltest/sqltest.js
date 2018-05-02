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

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  }
  else {
    queryDatabase();
 }
});

function queryDatabase() {
  // console.log('Reading rows from the Table...');

  // Read all rows from table
  request = new Request(
      "SELECT * FROM questions",
      function(err, rowCount, rows) {
        // console.log(rowCount + ' row(s) returned');
        // process.exit();
      }
  );

  request.on('row', function(columns) {
    columns.forEach(function(column) {
      let toReturn = ""; // will store the results of each column
      // console.log("%s\t%s", column.metadata.colName, column.value);
      dbResults.push(column.metadata.colName + "\t" + column.value + "\n");
      // return toReturn; // after each column loop, return the results
    });
  });

  connection.execSql(request);
}

// Make publicly available
module.exports.queryDatabase = queryDatabase;
module.exports.dbResults = dbResults;