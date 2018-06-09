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

function getAnswerSimilarities(searchQuery) {
    return new Promise((resolve, reject) => {
    });
}

exports.getQuestionSimilarities = getQuestionSimilarities;
exports.getAnswerSimilarities = getAnswerSimilarities;