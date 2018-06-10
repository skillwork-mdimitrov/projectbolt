var stringSimilarity = require('string-similarity');
var database = require('./database');

function getQuestionSimilarities(searchQuery) {
    return new Promise((resolve, reject) => {
        database.getAllQuestions().then((questions) => {
            var questionsArray = [];
            questions.forEach(function(question) {
                questionsArray.push(question.Question);
            });

            if (questionsArray.length > 0) {
                resolve(stringSimilarity.findBestMatch(searchQuery, questionsArray));
            }
            else {
                resolve({bestMatch: {target: "", rating: 0.0}, ratings: [{target: "", rating: 0.0}]});
            }   
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

            if (answersArray.length > 0) {
                resolve(stringSimilarity.findBestMatch(searchQuery, answersArray));
            }
            else {
                resolve({bestMatch: {target: "", rating: 0.0}, ratings: [{target: "", rating: 0.0}]});
            }            
        }).catch((reason) => {
            reject(reason);
        });  
    });
}

exports.getQuestionSimilarities = getQuestionSimilarities;
exports.getAnswerSimilarities = getAnswerSimilarities;