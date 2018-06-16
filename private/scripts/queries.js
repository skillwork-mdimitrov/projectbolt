var TYPES = require('tedious').TYPES;

function getRatingsByAnswerIdQuery(answerID) {
    var query  = "SELECT Rating FROM Ratings WHERE AnswerID = @answerID";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID}
    ]
    return {query: query, params: params};
}

function getNonBannedRatingsByAnswerIdQuery(answerID) {
    var query  = `SELECT Ratings.Rating
                FROM Ratings 
                INNER JOIN Users ON Ratings.UserID=Users.ID 
                WHERE AnswerID = @answerID AND Users.Banned = 0`;
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

function getAllNonBannedQuestionsQuery() {
    var query = `SELECT Questions.ID, Questions.Question, Questions.UserID, Users.Username 
                FROM Questions 
                INNER JOIN Users ON Questions.UserID=Users.ID 
                WHERE Users.Banned = 0`;
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

function getQuestionIdByTextQuery(question) {
    var query = "SELECT ID FROM Questions WHERE Question = @question";
    var params = [
        {paramName: "question", paramType: TYPES.NVarChar, paramValue: question}
    ]
    return {query: query, params: params};
}

function getUserIdByQuestionIdQuery(questionID) {
    var query = "SELECT UserID FROM Questions WHERE ID in ( @questionID )";
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

function getDeleteQuestionQuery(questionID) {
    var query  = "DELETE FROM Questions WHERE ID = @questionID";
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID}
    ]
    return {query: query, params: params};
}

function getAnswersByQuestionIdQuery(questionID) {
    var query = `SELECT Answers.ID, Answers.Answer, Users.Username 
                FROM Answers 
                INNER JOIN Users ON Answers.UserID=Users.ID 
                WHERE QuestionID in ( @questionID )`;
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID}
    ]
    return {query: query, params: params};
}

function getUsernameByAnswerQuery(questionID, answer) {
    var query = `SELECT Users.FirstName 
                FROM Answers
                INNER JOIN Users ON Answers.UserID=Users.ID 
                WHERE QuestionID in ( @questionID ) AND Answer = @answer`;
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID},
        {paramName: "answer", paramType: TYPES.NVarChar, paramValue: answer}
    ]
    return {query: query, params: params};
}

function getUserIdByAnswerIdQuery(answerID) {
    var query = "SELECT UserID FROM Answers WHERE ID = @answerID";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID}
    ]
    return {query: query, params: params};
}

function getAnswerIdByTextQuery(answer) {
    var query = "SELECT ID FROM Answers WHERE Answer = @answer";
    var params = [
        {paramName: "answer", paramType: TYPES.NVarChar, paramValue: answer}
    ]
    return {query: query, params: params};
}

function getNonBannedAnswersByQuestionIdQuery(questionID) {
    var query = `SELECT Answers.ID, Answers.Answer, Answers.Verified, Users.Username 
                FROM Answers 
                INNER JOIN Users ON Answers.UserID=Users.ID 
                WHERE QuestionID in ( @questionID ) AND Users.Banned = 0`;
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID}
    ]
    return {query: query, params: params};
}

function getInsertAnswerQuery(answer, questionID, userID, date) {
    var query = "INSERT INTO Answers (answer, questionid, userid, date) VALUES ( @answer , @questionID , @userID , @date)";
    var params = [
        {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID},
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID},
        {paramName: "answer", paramType: TYPES.NVarChar, paramValue: answer},
		{paramName: "date", paramType: TYPES.NVarChar, paramValue: date}
    ]
    return {query: query, params: params}; 
}

function getInsertVisitsQuery(questionID, date) {
    var query = "INSERT INTO VisitsStats (QuestionID, VisitDate) VALUES ( @questionID, @date );";
    var params = [
      {paramName: "questionID", paramType: TYPES.Int, paramValue: questionID},
      {paramName: "date", paramType: TYPES.Date, paramValue: date}
    ];
  return {query: query, params: params}
}

function getDeleteAnswerQuery(answerID) {
    var query  = "DELETE FROM Answers WHERE ID = @answerID";
    var params = [
        {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID}
    ]
    return {query: query, params: params};
}

function getVerifyAnswerQuery(answerID) {
  var query  = "UPDATE Answers SET Verified = 'true' WHERE ID = @answerID";
  var params = [
    {paramName: "answerID", paramType: TYPES.Int, paramValue: answerID}
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

function getVisitsForAllQuestionsQuery() {
    var query = "SELECT QuestionID, COUNT(QuestionID) AS NumberOfVisits\n" +
        "FROM VisitsStats\n" +
        "GROUP BY QuestionID;";
    var params = [];
    return {query: query, params: params};
}

function getUsernameByIdQuery(userID) {
    var query = "SELECT Username FROM Users WHERE ID = @userID";
    var params = [
        {paramName: "userID", paramType: TYPES.Int, paramValue: userID}
    ]
    return {query: query, params: params};
}

function getFirstnameByIdQuery(userID) {
    var query = "SELECT FirstName FROM Users WHERE ID = @userID";
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

function getUserBannedStatusByIdQuery(userID) {
  var query = "SELECT Banned FROM Users WHERE ID = @userID";
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

function getUsersPostedAnsersByMonth(monthStart, monthEnd) {
    var query = `
				SELECT dbo.Answers.UserID, COUNT(*) AS Answers
				FROM dbo.Answers
				WHERE dbo.Answers.Date between @monthStart and @monthEnd
				GROUP BY dbo.Answers.UserID 
				ORDER BY COUNT(*) DESC;
				`;
    var params = [
		{paramName: "monthStart", paramType: TYPES.NVarChar, paramValue: monthStart},
        {paramName: "monthEnd", paramType: TYPES.NVarChar, paramValue: monthEnd}
    ]
    return {query: query, params: params};
}

exports.getRatingsByAnswerIdQuery = getRatingsByAnswerIdQuery;
exports.getNonBannedRatingsByAnswerIdQuery = getNonBannedRatingsByAnswerIdQuery;
exports.getRatingByAnswerIdAndUserIdQuery = getRatingByAnswerIdAndUserIdQuery;
exports.getInsertRatingQuery = getInsertRatingQuery;
exports.getUpdateRatingQuery = getUpdateRatingQuery;

exports.getAllQuestionsQuery = getAllQuestionsQuery;
exports.getAllNonBannedQuestionsQuery = getAllNonBannedQuestionsQuery;
exports.getQuestionTextByIdQuery = getQuestionTextByIdQuery;
exports.getQuestionIdByTextQuery = getQuestionIdByTextQuery;
exports.getUserIdByQuestionIdQuery = getUserIdByQuestionIdQuery;
exports.getInsertQuestionQuery = getInsertQuestionQuery;
exports.getDeleteQuestionQuery = getDeleteQuestionQuery;

exports.getAnswersByQuestionIdQuery = getAnswersByQuestionIdQuery;
exports.getUsernameByAnswerQuery = getUsernameByAnswerQuery;
exports.getVisitsForAllQuestionsQuery = getVisitsForAllQuestionsQuery;
exports.getUserIdByAnswerIdQuery = getUserIdByAnswerIdQuery;
exports.getAnswerIdByTextQuery = getAnswerIdByTextQuery;
exports.getNonBannedAnswersByQuestionIdQuery = getNonBannedAnswersByQuestionIdQuery;
exports.getInsertAnswerQuery = getInsertAnswerQuery;
exports.getInsertVisitsQuery = getInsertVisitsQuery;
exports.getDeleteAnswerQuery = getDeleteAnswerQuery;
exports.getVerifyAnswerQuery = getVerifyAnswerQuery;

exports.getUsernamesBannedStatusQuery = getUsernamesBannedStatusQuery;
exports.getIdPasswordByUsernameQuery = getIdPasswordByUsernameQuery;
exports.getUsernameByIdQuery = getUsernameByIdQuery;
exports.getFirstnameByIdQuery = getFirstnameByIdQuery;
exports.getUserRoleByIdQuery = getUserRoleByIdQuery;
exports.getUserBannedStatusByIdQuery = getUserBannedStatusByIdQuery;
exports.getBanUserQuery = getBanUserQuery;
exports.getUnbanUserQuery = getUnbanUserQuery;
exports.getUsersPostedAnsersByMonth = getUsersPostedAnsersByMonth;