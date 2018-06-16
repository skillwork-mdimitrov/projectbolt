var database = require('./database');

var multipliers = {
    answerMultiplier: 5,
    visitMultiplier: 0.5,
    ratingMultiplier: 2
};

/// <summary>Returns the most popular questions based on the amount of answers, rating and visits.</summary>
/// <param name="amount" type="Number">How much questions need to be returned</param>
/// <returns type="Number">A promise that returns a list of most popular questions. The amount is depending on the parameter</returns>
function getMostPopularQuestions(amount)
{
    return new Promise((resolve, reject) => {
        database.getAllQuestionsForPopular().then((questions) => {

            // Step 1: Give each question a score
            // The question already contains all the answerCounts, visits and ratings
            questions.forEach(async (question) => {
                question.score = getScore(question);
            });

            // Step 2: Sorting the questions
            // Here the questions will get sorted based on their popularity scores (from high to low)
            let sortedQuestions = questions.sort(compare);

            // Step 3: Return the most popular questions
            // Return the x most popular ones (based on the 'amount' parameter)
            resolve(sortedQuestions.slice(0, amount));
        }).catch((reason) => {
                reject(reason);
        });
    });
}

/// <summary>Calculates a popularity score based of a question based on the amount of answers, rating and visits</summary>
/// <param name="question" type="Question">The question to calculate the score for</param>
/// <returns type="Number">The popularity score of the question</returns>
function getScore(question)
{
    return (question.AnswerCount * multipliers.answerMultiplier) +
           (question.VisitCount * multipliers.visitMultiplier) +
           (question.TotalRating * multipliers.ratingMultiplier);
}

// The compare function (from high to low)
function compare(a, b)
{
    return b.score - a.score;
}

exports.getMostPopularQuestions = getMostPopularQuestions;
