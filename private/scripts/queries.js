function getAllRatingsQuery(answerID) {
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

function getInsertQuestionQuery(question, userID) {
    return "INSERT INTO Questions (Question, UserID) VALUES ('" + question + "', '" + userID + "')";
}

exports.getAllRatingsQuery = getAllRatingsQuery;
exports.getInsertRatingQuery = getInsertRatingQuery;

exports.getAllQuestionsQuery = getAllQuestionsQuery;
exports.getInsertQuestionQuery = getInsertQuestionQuery;