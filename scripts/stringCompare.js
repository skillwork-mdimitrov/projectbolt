// THIS NEEDS TO BE DELETED
var query;
var sanitizedQuery;
// ------------------------

function evaluateQuery(theQuery)
{
    query = document.getElementById("query").value;
    sanitizedQuery = sanitize(query);
    var output = document.getElementById("output");

    output.innerHTML = "";
    theQuery.forEach(printSimilarity, output);
}

function printSimilarity(item)
{
    var similarity = getSimilarity(item);
    var newRow = this.insertRow(0);

    var question_cell = newRow.insertCell(0);
    var similarityCell = newRow.insertCell(1);

    question_cell.innerHTML = item;
    similarityCell.innerHTML = similarity + "%";  
}

function getSimilarity(question)
{
    var similarity = 0;
    var sanitizedQuestion = sanitize(question);

    if (query === question || sanitizedQuery === sanitizedQuestion)
    {
        similarity = 100;
    }
    else
    {
        var stringLengthWeight = 0.05;
        var characterOccurenceWeight = 0.125;
        var characterPositionWeight = 0.125;
        var wordOccurenceWeight = 0.20;
        var wordPositionWeight = 0.15;
        var sentenceOccurenceWeight = 0.25;

        similarity += getStringLengthSimilarity(sanitizedQuestion) * stringLengthWeight;
        similarity += getCharacterOccurenceSimilarity(sanitizedQuestion) * characterOccurenceWeight;
        similarity += getCharacterPositionSimilarity(sanitizedQuestion) * characterPositionWeight;
        similarity += getWordOccurenceSimilarity(sanitizedQuestion) * wordOccurenceWeight;
        similarity += getWordPositionSimilarity(sanitizedQuestion) * wordPositionWeight;
        similarity += getSentenceOccurenceSimilarity(sanitizedQuestion) * sentenceOccurenceWeight;
    }

    return Math.round(similarity);
}

function sanitize(string)
{
    var sanitizedQuestion = string;

    sanitizedQuestion = string.toLowerCase();
    sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s]/g, "");

    return sanitizedQuestion;
}

function getStringLengthSimilarity(question)
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

function getCharacterOccurenceSimilarity(question)
{
    var similarity = 100;

    var questionCharacters = [];
    for (var i = 0; i < question.length; i++)
    {
        var character = question.charAt(i);        
        if (questionCharacters.indexOf(character) === -1)
        {
            questionCharacters.push(character);
        }
    }

    var decrement = similarity / questionCharacters.length;
    questionCharacters.forEach(function(character)
    {
        if (sanitizedQuery.indexOf(character) === -1)
        {
            similarity -= decrement;
        }
    });

    return similarity;
}

function getCharacterPositionSimilarity(question)
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

function getWordOccurenceSimilarity(question)
{
    var similarity = 100;

    var questionWords = question.split(" ");
    var queryWords = sanitizedQuery.split(" ");

    var decrement = similarity / questionWords.length;
    questionWords.forEach(function(word)
    {
        if (queryWords.indexOf(word) === -1)
        {
            similarity -= decrement;
        }
    });

    return similarity;
}

function getWordPositionSimilarity(question)
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

function getSentenceOccurenceSimilarity(question)
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