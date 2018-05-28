var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var queries = require('./queries');
var TYPES = require('tedious').TYPES;

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
                request = new Request(query.query, function(err) {
                    if (err) {
                        console.log(err);
                        reject(new Error(err));
                    } else {
                        resolve("Operation successful");
                    }
                    connection.close();
                });      
                
                query.params.forEach(function(param) {
                    request.addParameter(param.paramName, param.paramType, param.paramValue);
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

        request = new Request(query.query, function(err, rowCount) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
            connection.close();
        });

        query.params.forEach(function(param) {
            request.addParameter(param.paramName, param.paramType, param.paramValue);
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

function getNonBannedRatingsByAnswerId(answerID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getNonBannedRatingsByAnswerIdQuery(answerID)).then((ratings) => {
            resolve(ratings);
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function getRatingByAnswerIdAndUserId(answerID, userID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getRatingByAnswerIdAndUserIdQuery(answerID, userID)).then((rating) => {
            resolve(rating);
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function insertRating(answerID, userID, rating) {
    return new Promise((resolve, reject) => {
        runGenericQuery(queries.getInsertRatingQuery(answerID, userID, rating)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function updateRating(answerID, userID, rating) {
    return new Promise((resolve, reject) => {
        runGenericQuery(queries.getUpdateRatingQuery(answerID, userID, rating)).then(() => {
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

function getAllNonBannedQuestions() {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getAllNonBannedQuestionsQuery()).then((questions) => {
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
        runGenericQuery(queries.getInsertQuestionQuery(question, userID)).then(() => {
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

function getNonBannedAnswersByQuestionId(questionID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getNonBannedAnswersByQuestionIdQuery(questionID)).then((answers) => {
            resolve(answers);
        }).catch((reason) => {
            reject(reason);
        }); 
    });   
}

function insertAnswer(answer, questionID, userID) {
    return new Promise((resolve, reject) => {
        runGenericQuery(queries.getInsertAnswerQuery(answer, questionID, userID)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function getUsernamesBannedStatus() {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getUsernamesBannedStatusQuery()).then((userData) => {
            resolve(userData);
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

function getUserRoleById(userID) {
    return new Promise((resolve, reject) => {
        getJsonDataSet(queries.getUserRoleByIdQuery(userID)).then((userRole) => {
            resolve(userRole);
        }).catch((reason) => {
            reject(reason);
        }); 
    });  
}

function getUserBannedStatusById(userID) {
  return new Promise((resolve, reject) => {
    getJsonDataSet(queries.getUserBannedStatusByIdQuery(userID)).then((banned) => {
      resolve(banned);
    }).catch((reason) => {
      reject(reason);
    });
  });
}

function banUser(userID) {
    return new Promise((resolve, reject) => {
        runGenericQuery(queries.getBanUserQuery(userID)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

function unbanUser(userID) {
    return new Promise((resolve, reject) => {
        runGenericQuery(queries.getUnbanUserQuery(userID)).then(() => {
            resolve();
        }).catch((reason) => {
            reject(reason);
        }); 
    });
}

exports.runGenericQuery = runGenericQuery;
exports.getJsonDataSet = getJsonDataSet;

exports.getRatingsByAnswerId = getRatingsByAnswerId;
exports.getNonBannedRatingsByAnswerId = getNonBannedRatingsByAnswerId;
exports.getRatingByAnswerIdAndUserId = getRatingByAnswerIdAndUserId;
exports.insertRating = insertRating;
exports.updateRating = updateRating;

exports.getAllQuestions = getAllQuestions;
exports.getAllNonBannedQuestions = getAllNonBannedQuestions;
exports.getQuestionTextById = getQuestionTextById;
exports.insertQuestion = insertQuestion;

exports.getAnswersByQuestionId = getAnswersByQuestionId;
exports.getNonBannedAnswersByQuestionId = getNonBannedAnswersByQuestionId;
exports.insertAnswer = insertAnswer;

exports.getUsernamesBannedStatus = getUsernamesBannedStatus;
exports.getIdPasswordByUsername = getIdPasswordByUsername;
exports.getUsernameById = getUsernameById;
exports.getUserRoleById = getUserRoleById;
exports.getUserBannedStatusById = getUserBannedStatusById;
exports.banUser = banUser;
exports.unbanUser = unbanUser;