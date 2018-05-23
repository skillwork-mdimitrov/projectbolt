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
                row[column.metadata.colName] = column.value;
            });
            result.push(row);
        });

        connection.execSql(request);
    });  
}

function getRatingsByAnswerId(answerID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getRatingsByAnswerIdQuery(answerID)).then((ratings) => {
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

function getAllQuestions() {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getAllQuestionsQuery()).then((questions) => {
            resolve(questions);
        }).catch((reason) => {
            reject(reason);
        }); 
    });   
}

function getQuestionTextById(questionID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getQuestionTextByIdQuery(questionID)).then((questionText) => {
            resolve(questionText);
        }).catch((reason) => {
            reject(reason);
        }); 
    }); 
}

function insertQuestion(question, userID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getInsertQuestionQuery(question, userID)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });   
}

function getAnswersByQuestionId(questionID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getAnswersByQuestionIdQuery(questionID)).then((answers) => {
            resolve(answers);
        }).catch((reason) => {
            reject(reason);
        }); 
    });   
}

function insertAnswer(answer, questionID) { 
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getInsertAnswerQuery(answer, questionID)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function getIdPasswordByUsername(username) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getIdPasswordByUsernameQuery(username)).then((userData) => {
            resolve(userData);
        }).catch((reason) => {
            reject(reason);
        }); 
    });  
}

function getUsernameById(userID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getUsernameByIdQuery(userID)).then((username) => {
            resolve(username);
        }).catch((reason) => {
            reject(reason);
        }); 
    });  
}

exports.runGenericQuery = runGenericQuery;
exports.getJsonDataSet = getJsonDataSet;

exports.getRatingsByAnswerId = getRatingsByAnswerId;
exports.insertRating = insertRating;

exports.getAllQuestions = getAllQuestions;
exports.getQuestionTextById = getQuestionTextById;
exports.insertQuestion = insertQuestion;

exports.getAnswersByQuestionId = getAnswersByQuestionId;
exports.insertAnswer = insertAnswer;

exports.getIdPasswordByUsername = getIdPasswordByUsername;
exports.getUsernameById = getUsernameById;