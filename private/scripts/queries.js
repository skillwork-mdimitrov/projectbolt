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

exports.getAllRatingsQuery = getAllRatingsQuery;
exports.getInsertRatingQuery = getInsertRatingQuery;