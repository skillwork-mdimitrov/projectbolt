var stringSimilarity = require('string-similarity');
var database = require('./database');

/*
    The following functions compute the similarity of a search string with all the answers or questions
    Using the string-similarity library from JQUERY
*/

// Get the similarity ratings compared to all questions in the database
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

// Get the similarity ratings compared to all answers in the database
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

// Function definitions for accessing in other scripts

exports.getQuestionSimilarities = getQuestionSimilarities;
exports.getAnswerSimilarities = getAnswerSimilarities;