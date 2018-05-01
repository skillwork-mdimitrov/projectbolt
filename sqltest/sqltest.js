var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
  userName: '', // update me
  password: 'FUCKYOU', // update me
  database: 'mytestdb', // for sure
  server: 'localhost' // for sure
};

// var config = {
//   userName: 'testUser', // update me
//   // password: 'admin',  // update me
//   server: 'MAKSIM-PC', // update me
//   database: 'mytestdb', // update me
//   option: {
//     instanceName: "MSSQLSERVER", // update me
//     database: 'mytestdb' // update me
//   }
// };

var connection = new Connection(config);

connection.on('connect', function (err) {
  if (err) {
    console.log(err);
  } else {
    executeStatement();
  }
});

function executeStatement() {
  request = new Request("USE NodeSql; select * from Code ", function (err, rowCount) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
    }
    connection.close();
  });

  request.on('row', function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log('NULL');
      } else {
        console.log(column.value);
      }
    });
  });

  connection.execSql(request);
}