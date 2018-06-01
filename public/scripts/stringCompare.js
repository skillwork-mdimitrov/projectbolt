/* stringCompare NAMESPACE
 ============================================================== */
const stringCompare = function() {
    let questionBox = $("#questionBox");
    let autoCompleter;
    let queryTimeout = false;
    let questionSet = [];    

    const retrieveAndEvaluate = function(searchQuery)
    {
        sanitizedQuery = sanitize(searchQuery);
        var questionSimilarityMapping = new Map();
        var sessionID = sessionStorage.getItem('projectBoltSessionID');

        console.log("Retrieving all questions");
        $.getJSON( "questions/get-all-questions/"+sessionID, function() {})
        .done(function(data) {
            console.log("All questions recieved");
            $.each( data, function( key, val ) {
                questionSet.push(val["Question"]);
            });

            $.each( questionSet, function( index, value ) {
                mapSimilarities(value, searchQuery, sanitizedQuery, questionSimilarityMapping);
            });

            questionSimilarityMapping[Symbol.iterator] = function* () {
                yield* [...this.entries()].sort((a, b) =>  b[1] - a[1]);
            }

            var optionsArray = []
            for (let [key, value] of questionSimilarityMapping) {
                optionsArray.push(key);
            }
            stringCompare.autoCompleter.list = optionsArray;
            stringCompare.autoCompleter.evaluate();
        })
        .fail(function(message) {
            unfoldingHeader.unfoldHeader("Failed retrieving questions, see console for details", "red", true);
            console.log("Failed retrieving all questions: " + message);
        })
    }

    const evaluateQuery = function(searchQuery)
    {
        if (queryTimeout)
        {
            sanitizedQuery = sanitize(searchQuery);
            var questionSimilarityMapping = new Map();

            $.each( questionSet, function( index, value ) {
                mapSimilarities(value, searchQuery, sanitizedQuery, questionSimilarityMapping);
            });

            questionSimilarityMapping[Symbol.iterator] = function* () {
                yield* [...this.entries()].sort((a, b) =>  b[1] - a[1]);
            }

            var optionsArray = []
            for (let [key, value] of questionSimilarityMapping) {
                optionsArray.push(key);
            }
            stringCompare.autoCompleter.list = optionsArray;
            stringCompare.autoCompleter.evaluate();
        }
        else
        {
            queryTimeout = true;
            retrieveAndEvaluate(searchQuery);
            setTimeout( function() { queryTimeout = false; }, 1000);
        }
    }

    //Check if the question is similar to one other previous asked questions
    const mapSimilarities = function(question, originalQuery, sanitizedQuery, questionSimilarityMapping)
    {
        var questionSimilarity = getSimilarity(question, originalQuery, sanitizedQuery);
        if (questionSimilarity > 25)
        {
            questionSimilarityMapping.set(question, questionSimilarity);  
        }        
    }

    const getSimilarity = function(question, originalQuery, sanitizedQuery)
    {
        var similarity = 0;
        var sanitizedQuestion = sanitize(question);

        if (originalQuery === question || sanitizedQuery === sanitizedQuestion)
        {
            similarity = 100;
        }
        else
        {
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

        return Math.round(similarity);
    }

    const sanitize = function(string)
    {
        var sanitizedQuestion = string;

        sanitizedQuestion = string.toLowerCase();
        sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s]/g, "");

        return sanitizedQuestion;
    }

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
        questionBox: questionBox,
        retrieveAndEvaluate: retrieveAndEvaluate,
        evaluateQuery: evaluateQuery,
        mapSimilarities: mapSimilarities,
        getSimilarity: getSimilarity,
        sanitize: sanitize,
        getStringLengthSimilarity: getStringLengthSimilarity,
        getCharacterOccurenceSimilarity: getCharacterOccurenceSimilarity,
        getCharacterPositionSimilarity: getCharacterPositionSimilarity,
        getWordOccurenceSimilarity: getWordOccurenceSimilarity,
        getWordPositionSimilarity: getWordPositionSimilarity,
        getSentenceOccurenceSimilarity: getSentenceOccurenceSimilarity
    }
}();
//  ============================================================== */

$(document).ready(function() {
    var input = document.getElementById("questionBox");
    stringCompare.autoCompleter = new Awesomplete(input, {
        minChars: 1,
        sort: false,
        filter: function (text, input)
        {
            return true;
        }
    });

    stringCompare.questionBox.on("input", function() {
        if (stringCompare.questionBox.val().length > 0)
        {
            stringCompare.evaluateQuery(stringCompare.questionBox.val());
        }        
    });
});


