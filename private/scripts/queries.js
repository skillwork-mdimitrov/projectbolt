function getRatingsByAnswerIdQuery(answerID) {
    return "SELECT Rating FROM Ratings WHERE AnswerID = " + answerID;
}

function getInsertRatingQuery(answerID, userID, rating) {
    return "INSERT INTO Ratings (AnswerID, UserID, Rating) VALUES (" 
                                                                + answerID + ", " 
                                                                + userID + ", " 
                                                                + rating 
                                                                + ")";
}

function getAllQuestionsQuery() {
    return "SELECT * FROM Questions";
}

function getQuestionTextByIdQuery(questionID) {
    return "SELECT Question FROM Questions WHERE ID in (" + questionID + ")";
}

function getInsertQuestionQuery(question, userID) {
    return "INSERT INTO Questions (Question, UserID) VALUES ('" + question + "', '" + userID + "')";
}

function getAnswersByQuestionIdQuery(questionID) {
    return "SELECT * FROM Answers WHERE QuestionID in (" + questionID + ")";
}

function getInsertAnswerQuery(answer, questionID) {
    return "INSERT INTO answers (answer, questionid) VALUES ('" + answer + "', '" + questionID + "')";
}

function getIdPasswordByUsernameQuery(username) {
    return "SELECT ID, password FROM Users WHERE Username= '" + username + "'";
} 

function getUsernameByIdQuery(userID) {
    return "SELECT Username FROM Users WHERE ID = " + userID;
}

exports.getRatingsByAnswerIdQuery = getRatingsByAnswerIdQuery;
exports.getInsertRatingQuery = getInsertRatingQuery;

exports.getAllQuestionsQuery = getAllQuestionsQuery;
exports.getQuestionTextByIdQuery = getQuestionTextByIdQuery;
exports.getInsertQuestionQuery = getInsertQuestionQuery;

exports.getAnswersByQuestionIdQuery = getAnswersByQuestionIdQuery;
exports.getInsertAnswerQuery = getInsertAnswerQuery;

exports.getIdPasswordByUsernameQuery = getIdPasswordByUsernameQuery;
exports.getUsernameByIdQuery = getUsernameByIdQuery;