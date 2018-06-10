var stringSimilarity = require('string-similarity');
var database = require('./database');

function getQuestionSimilarities(searchQuery) {
    return new Promise((resolve, reject) => {
        database.getAllQuestions().then((questions) => {
            var questionsArray = [];
            questions.forEach(function(question) {
                questionsArray.push(question.Question);
            });

            resolve(stringSimilarity.findBestMatch(searchQuery, questionsArray));
        }).catch((reason) => {
            reject(reason);
        });  
    });
}

function getAnswerSimilarities(searchQuery, questionID) {
    return new Promise((resolve, reject) => {
        database.getAnswersByQuestionId(questionID).then((answers) => {
            var answersArray = [];
            answers.forEach(function(answer) {
                answersArray.push(answer.Answer);
            });

            resolve(stringSimilarity.findBestMatch(searchQuery, answersArray));
        }).catch((reason) => {
            reject(reason);
        });  
    });
}

exports.getQuestionSimilarities = getQuestionSimilarities;
exports.getAnswerSimilarities = getAnswerSimilarities;