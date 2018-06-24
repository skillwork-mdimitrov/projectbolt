/* String compare functions namespace
 ============================================================== */
const compare = function() {

    // Main function for retrieving the similarity between two strings
    // Makes use of all the following functions and combines them with 
    // A pre specified weighting distribution
    const getCombinedSimularity = function(question, query)
    {
        var similarity = 0;
        var sanitizedQuestion = sanitize(question);

        // If the two strings are similar by basic comparison then return 100% match
        if (originalQuery === question || sanitizedQuery === sanitizedQuestion)
        {
            similarity = 100;
        }
        else
        {
            // The different functions have different weights
            // Towards the overall similarity of the strings
            var stringLengthWeight = 0.05;
            var characterOccurenceWeight = 0.175;
            var characterPositionWeight = 0.125;
            var wordOccurenceWeight = 0.20;
            var wordPositionWeight = 0.15;
            var sentenceOccurenceWeight = 0.20;

            similarity += getStringLengthSimilarity(sanitizedQuestion, sanitizedQuery) * stringLengthWeight;
            similarity += getCharacterOccurenceSimilarity(sanitizedQuestion, sanitizedQuery) * characterOccurenceWeight;
            similarity += getCharacterPositionSimilarity(sanitizedQuestion, sanitizedQuery) * characterPositionWeight;
            similarity += getWordOccurenceSimilarity(sanitizedQuestion, sanitizedQuery) * wordOccurenceWeight;
            similarity += getWordPositionSimilarity(sanitizedQuestion, sanitizedQuery) * wordPositionWeight;
            similarity += getSentenceOccurenceSimilarity(sanitizedQuestion, sanitizedQuery) * sentenceOccurenceWeight;
        }

        // Rounded towards the next integer
        return Math.round(similarity);
    }

    // Sanatize a string to remove any non-essential elements for comparison
    const sanitize = function(string)
    {
        var sanitizedQuestion = string;

        sanitizedQuestion = string.toLowerCase();
        sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s]/g, "");

        return sanitizedQuestion;
    }

    // Get the similarity rating based on string length
    const getStringLengthSimilarity = function(question, sanitizedQuery)
    {
        var similarity = 100;

        if (sanitizedQuery.length !== question.length)
        {
            var difference = Math.abs(sanitizedQuery.length - question.length);
            if (difference < question.length)
            {
                similarity -= similarity * (difference / question.length);
            }
            else
            {
                similarity = 0;
            }        
        }

        return similarity;
    }

    // Get the similarity rating based on the amount of times 
    // Different characters appear in both strings
    const getCharacterOccurenceSimilarity = function(question, sanitizedQuery)
    {
        var similarity = 100;

        var questionCharacterCounts = {};
        for (var i = 0; i < question.length; i++)
        {
            if (questionCharacterCounts[question.charAt(i)] === undefined)
            {
                questionCharacterCounts[question.charAt(i)] = 1;
            }  
            else
            {
                questionCharacterCounts[question.charAt(i)] += 1;
            }
        }
        var queryCharacterCounts = {};
        for (var i = 0; i < sanitizedQuery.length; i++)
        {
            if (queryCharacterCounts[sanitizedQuery.charAt(i)] === undefined)
            {
                queryCharacterCounts[sanitizedQuery.charAt(i)] = 1;
            }  
            else
            {
                queryCharacterCounts[sanitizedQuery.charAt(i)] += 1;
            }
        }

        var decrement = similarity / (Object.keys(questionCharacterCounts).length*2);
        Object.keys(questionCharacterCounts).forEach( function(key) {
            if (queryCharacterCounts[key] === undefined)
            {
                similarity -= decrement * 2;
            }
            else
            {
                if (queryCharacterCounts[key] !== questionCharacterCounts[key])
                {
                    similarity -= decrement;
                }
            }    
        });

        return similarity;
    }

    // Get the similarity rating based on the position of the 
    // Characters in both strings
    const getCharacterPositionSimilarity = function(question, sanitizedQuery)
    {
        var similarity = 100;

        var decrement = similarity / question.length;
        for (var i = 0; i < question.length; i++)
        {
            if (question.charAt(i) !== sanitizedQuery.charAt(i))
            {
                similarity -= decrement;
            }
        }
        
        return similarity;
    }

    // Get the similarity rating based on the amount of times
    // Different words appear in each string
    const getWordOccurenceSimilarity = function(question, sanitizedQuery)
    {
        var similarity = 100;

        var questionWords = question.split(" ");
        var queryWords = sanitizedQuery.split(" ");

        var questionWordCounts = {};
        questionWords.forEach( function(word)
        {
            if (questionWordCounts[word] === undefined)
            {
                questionWordCounts[word] = 1;
            }  
            else
            {
                questionWordCounts[word] += 1;
            }
        });
        var queryWordCounts = {};
        queryWords.forEach( function(word)
        {
            if (queryWordCounts[word] === undefined)
            {
                queryWordCounts[word] = 1;
            }  
            else
            {
                queryWordCounts[word] += 1;
            }
        });

        var decrement = similarity / (Object.keys(questionWordCounts).length*2);
        Object.keys(questionWordCounts).forEach( function(key) {
            if (queryWordCounts[key] === undefined)
            {
                similarity -= decrement * 2;
            }
            else
            {
                if (queryWordCounts[key] !== questionWordCounts[key])
                {
                    similarity -= decrement;
                }
            }    
        });

        return similarity;
    }

    // Get the similarity rating based on the position
    // Of the words in each string
    const getWordPositionSimilarity = function(question, sanitizedQuery)
    {
        var similarity = 100;

        var questionWords = question.split(" ");
        var queryWords = sanitizedQuery.split(" ");

        var decrement = similarity / questionWords.length;
        for (var i = 0; i < questionWords.length; i++)
        {
            if (questionWords[i] !== queryWords[i])
            {
                similarity -= decrement;
            }
        }

        return similarity;
    }

    // Get the similarity rating based on the longest part of
    // The string which matches the other string
    const getSentenceOccurenceSimilarity = function(question, sanitizedQuery)
    {
        var similarity = 100;

        var maxSimilarityCount = 0;
        for (var i = 1; i < question.length; i++)
        {
            for (var j = 0; j < question.length; j++)
            {
                var questionSubstring = question.substring(j, j+i);
                if (questionSubstring.length >= i)
                {
                    if (sanitizedQuery.indexOf(questionSubstring) !== -1 && questionSubstring.length > 0)
                    {
                        maxSimilarityCount = i;
                        break;
                    }
                }            
            }
        }
        var relativeSimilarity = maxSimilarityCount/sanitizedQuery.length;
        similarity *= relativeSimilarity;
        
        return similarity;
    }

    return {
        getSimilarity: getCombinedSimularity,
        sanitize: sanitize,
        getStringLengthSimilarity: getStringLengthSimilarity,
        getCharacterOccurenceSimilarity: getCharacterOccurenceSimilarity,
        getCharacterPositionSimilarity: getCharacterPositionSimilarity,
        getWordOccurenceSimilarity: getWordOccurenceSimilarity,
        getWordPositionSimilarity: getWordPositionSimilarity,
        getSentenceOccurenceSimilarity: getSentenceOccurenceSimilarity
    }
}();