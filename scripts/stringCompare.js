// THIS NEEDS TO BE DELETED
var query;
// ------------------------

function evaluateQuery(theQuery)
{
    query = document.getElementById("query").value;
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

    if (query === question)
    {
        similarity = 100;
    }
    else
    {
        var characterOccurenceWeight = 0.1;
        var characterPositionWeight = 0.1;
        var stringLengthWeight = 0.1;
        var wordOccurenceWeight = 0.25;
        var wordPositionWeight = 0.35;

        similarity += getCharacterOccurenceSimilarity(question) * characterOccurenceWeight;
        similarity += getCharacterPositionSimilarity(question) * characterPositionWeight;
        similarity += getStringLengthSimilarity(question) * stringLengthWeight;
        similarity += getWordOccurenceSimilarity(question) * wordOccurenceWeight;
        similarity += getWordPositionSimilarity(question) * wordPositionWeight;
    }

    return Math.round(similarity);
}

function getWordOccurenceSimilarity(question)
{
    var similarity = 100;

    var question_words = question.split(" ");
    var query_words = query.split(" ");

    var decrement = similarity / question_words.length;
    question_words.forEach(function(word)
    {
        if (query_words.indexOf(word) === -1)
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
    var queryWords = query.split(" ");

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
        if (query.indexOf(character) === -1)
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
        if (question.charAt(i) !== query.charAt(i))
        {
            similarity -= decrement;
        }
    }
    
    return similarity;
}

function getStringLengthSimilarity(question)
{
    var similarity = 100;

    if (query.length !== question.length)
    {
        var difference = Math.abs(query.length - question.length);
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