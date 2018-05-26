var TYPES = require('tedious').TYPES;

function getRatingsByAnswerIdQuery(answerID) {
    var query  = "SELECT Rating FROM Ratings WHERE AnswerID = @answerID";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID}
    ]
    return {query: query, params: params};
}

function getRatingByAnswerIdAndUserIdQuery(answerID, userID) {
    var query = "SELECT Rating FROM Ratings WHERE AnswerID = @answerID AND UserID = @userID";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID},
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

function getInsertRatingQuery(answerID, userID, rating) {
    var query = "INSERT INTO Ratings (AnswerID, UserID, Rating) VALUES ( @answerID , @userID , @rating )";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID},
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID},
        {paramName: "rating", paramType: TYPES.Int, paramValue: rating}
    ]
    return {query: query, params: params}; 
}

function getUpdateRatingQuery(answerID, userID, rating) {
    var query = "UPDATE Ratings SET Rating = @rating WHERE AnswerID = @answerID AND UserID = @userID";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID},
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID},
        {paramName: "rating", paramType: TYPES.Int, paramValue: rating}
    ]
    return {query: query, params: params};     
}

function getAllQuestionsQuery() {
    var query = "SELECT * FROM Questions INNER JOIN Users ON Questions.UserID=Users.ID";
    var params = []
    return {query: query, params: params};
}

function getQuestionTextByIdQuery(questionID) {
    var query = "SELECT Question FROM Questions WHERE ID in ( @questionID )";
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID}
    ]
    return {query: query, params: params};
}

function getInsertQuestionQuery(question, userID) {
    var query  = "INSERT INTO Questions (Question, UserID) VALUES ( @question , @userID )";
    var params = [
        {paramName: "question", paramType: TYPES.NVarChar, paramValue: question},
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

function getAnswersByQuestionIdQuery(questionID) {
    var query = "SELECT * FROM Answers WHERE QuestionID in ( @questionID )";
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID}
    ]
    return {query: query, params: params};
}

function getInsertAnswerQuery(answer, questionID, userID) {
    var query = "INSERT INTO answers (answer, questionid, userid) VALUES ( @answer , @questionID , @userID )";
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID},
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID},
        {paramName: "answer", paramType: TYPES.NVarChar, paramValue: answer}
    ]
    return {query: query, params: params}; 
}

function getUsernamesBannedStatusQuery() {
    var query = "SELECT ID, Username, Banned FROM Users";
    var params = []
    return {query: query, params: params};
}

function getIdPasswordByUsernameQuery(username) {
    var query = "SELECT ID, password FROM Users WHERE Username = @username";
    var params = [
        {paramName: "username", paramType: TYPES.NVarChar, paramValue: username}
    ]
    return {query: query, params: params};
} 

function getUsernameByIdQuery(userID) {
    var query = "SELECT Username FROM Users WHERE ID = @userID";
    var params = [
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

function getUserRoleByIdQuery(userID) {
    var query = "SELECT RoleID FROM Users WHERE ID = @userID";
    var params = [
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

function getBanUserQuery(userID) {
    var query = "UPDATE Users SET Banned = 1 WHERE ID = @userID";
    var params = [
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

function getUnbanUserQuery(userID) {
    var query = "UPDATE Users SET Banned = 0 WHERE ID = @userID";
    var params = [
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

exports.getRatingsByAnswerIdQuery = getRatingsByAnswerIdQuery;
exports.getRatingByAnswerIdAndUserIdQuery = getRatingByAnswerIdAndUserIdQuery;
exports.getInsertRatingQuery = getInsertRatingQuery;
exports.getUpdateRatingQuery = getUpdateRatingQuery;

exports.getAllQuestionsQuery = getAllQuestionsQuery;
exports.getQuestionTextByIdQuery = getQuestionTextByIdQuery;
exports.getInsertQuestionQuery = getInsertQuestionQuery;

exports.getAnswersByQuestionIdQuery = getAnswersByQuestionIdQuery;
exports.getInsertAnswerQuery = getInsertAnswerQuery;

exports.getUsernamesBannedStatusQuery = getUsernamesBannedStatusQuery;
exports.getIdPasswordByUsernameQuery = getIdPasswordByUsernameQuery;
exports.getUsernameByIdQuery = getUsernameByIdQuery;
exports.getUserRoleByIdQuery = getUserRoleByIdQuery;
exports.getBanUserQuery = getBanUserQuery;
exports.getUnbanUserQuery = getUnbanUserQuery;