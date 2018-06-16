var database = require('./database');

/// <summary>Returns the most popular questions based on the amount of answers, rating and visits.</summary>
/// <param name="amount" type="Number">How much questions need to be returned</param>
/// <returns type="Number">A promise that returns a list of most popular questions. The amount is depending on the parameter</returns>
function getMostPopularQuestions(amount)
{
    return new Promise((resolve, reject) => {
        database.getAllQuestionsForPopular().then((questions) => {

            // Step 1: Give each question a score
            // Here the questions list will be looped and each question will get a popularity score
            let scoredQuestions;
            questions.forEach(async (question) => {

                // Use amount of answers, ratings and clicks
                question.score = getScore(question);
            });

            console.log(questions);

            // Step 2: Sorting the questions
            // Here the questions will get sorted based on their popularity scores (from high to low)
            // TODO Sort all the questions from high to low score
            if (scoredQuestions.score >= )


            // Step 3: Return the most popular questions
            // Return the 10 most popular ones (based on the 'amount' parameter
            resolve(questions);
        }).catch((reason) => {
                reject(reason);
        });
    });
}

// TODO Base on visited aswell
/// <summary>Calculates a popularity score based of a question based on the amount of answers, rating and visits</summary>
/// <param name="question" type="Question">The question to calculate the score for</param>
/// <returns type="Number">The popularity score of the question</returns>
function getScore(question)
{
    // TODO Here you calculate the score and return it

    return 121;
}

exports.getMostPopularQuestions = getMostPopularQuestions;
