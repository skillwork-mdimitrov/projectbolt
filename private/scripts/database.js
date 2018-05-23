var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var queries = require('./queries');

var config = {
    userName: 'pbadmin',
    password: '56(E+!,?NGQ85tY"a%l#%5IU~[J>GU',
    server: 'projectboltrenew.database.windows.net',
    options: {
      database: 'ProjectBolt',
      encrypt: true
    }
};

function runGenericQuery(query)
{
    return new Promise((resolve, reject) => {
        var connection = new Connection(config);
        connection.on('connect', function(err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                request = new Request(query, function(err) {
                    if (err) {
                        console.log(err);
                        reject(new Error(err));
                    } else {
                        resolve("Operation successful");
                    }
                    connection.close();
                });        
                connection.execSql(request);
            }
        });
    });
}

function getJsonDataSet(query)
{
    return new Promise((resolve, reject) => {
        var connection = new Connection(config);
        connection.on('connect', function(err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                getQueryResult(connection, query).then((dataSet) => {
                    resolve(dataSet);
                }).catch((reason) => {
                    console.log('Handle rejected promise ('+reason+') here.');
                    reject(reason);
                });            
            }
        });
    }); 
}

function getQueryResult(connection, query) {
    return new Promise((resolve, reject) => {
        var result = [];

        request = new Request(query, function(err, rowCount) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
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
            result.push(row);
        });

        connection.execSql(request);
    });  
}

function getAllRatings(answerID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getAllRatingsQuery(answerID)).then((ratings) => {
            resolve(ratings);
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function insertRating(answerID, userID, rating) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getInsertRatingQuery(answerID, userID, rating)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

exports.runGenericQuery = runGenericQuery;
exports.getJsonDataSet = getJsonDataSet;

exports.getAllRatings = getAllRatings;
exports.insertRating = insertRating;