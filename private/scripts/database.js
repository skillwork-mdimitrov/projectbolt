var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'pbadmin',
    password: '56(E+!,?NGQ85tY"a%l#%5IU~[J>GU',
    server: 'projectboltrenew.database.windows.net',
    options: {
      database: 'ProjectBolt',
      encrypt: true
    }
};

function getAllQuestions()
{
  return new Promise((resolve, reject) => {
    var connection = new Connection(config);

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            reject(err);
        } else {
            getQuestions(connection).then((questions) => {
                resolve(questions);
            }).catch(
                (reason) => {
                console.log('Handle rejected promise ('+reason+') here.');
                reject(reason);
            });            
        }
    });
  });
}

function getQuestions(connection) {
    return new Promise((resolve, reject) => {
        var questions = [];

        request = new Request("SELECT * FROM Questions", function(err, rowCount) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(questions);
            }
            connection.close();
        });

        request.on('row', function(columns) {
            var row = {}; 
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {          
                    row[column.metadata.colName] = column.value;
                }
            });
            questions.push(row);
        });

        connection.execSql(request);
    });  
}

exports.getAllQuestions = getAllQuestions;