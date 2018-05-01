var connAndQuery = function () {
  var Connection = require('tedious').Connection;
  var Request = require('tedious').Request;

  var config = {
    userName: 'pbadmin', // update me
    password: '56(E+!,?NGQ85tY"a%l#%5IU~[J>GU', // update me
    server: 'projectbolt.database.windows.net', // update me
    options: {
      database: 'ProjectBolt', // update me
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
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT * FROM questions",
        function(err, rowCount, rows) {
          // console.log(rowCount + ' row(s) returned');
          // process.exit();
        }
    );

    request.on('row', function(columns) {
      let toWrite = "";
      columns.forEach(function(column) {
        // console.log("%s\t%s", column.metadata.colName, column.value);
        toWrite += column.metadata.colName + "\t" + column.value + "\t";
      });
      return toWrite;
    });

    connection.execSql(request);
  }
};

// Export connAndQuery function to the public
module.exports.queryDB = connAndQuery;