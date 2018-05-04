var query;
var questions = [
                "What is life?", 
                "How was it started?", 
                "How will it end?",
                "What will happen to the sun?",
                "And what about the moon?",
                "And the stars?"
                ];

function evaluate_query(theQuery)
{
    query = document.getElementById("query").value;
    var output = document.getElementById("output");

    output.innerHTML = "";
    theQuery.forEach(print_similarity, output);
}

function print_similarity(item)
{
    var similarity = get_similarity(item);
    var new_row = this.insertRow(0);

    var question_cell = new_row.insertCell(0);
    var similarity_cell = new_row.insertCell(1);

    question_cell.innerHTML = item;
    similarity_cell.innerHTML = similarity + "%";  
}

function get_similarity(question)
{
    var similarity = 0;

    if (query === question)
    {
        similarity = 100;
    }
    else
    {
        var character_occurence_weight = 1.0;
        var character_position_weight = 1.0;
        var string_length_weight = 1.0;
        var word_occurence_weight = 1.0;
        var word_position_weight = 1.0;

        similarity += get_character_occurence_similarity(question) * character_occurence_weight;
        similarity += get_character_position_similarity(question) * character_position_weight;
        similarity += get_string_length_similarity(question) * string_length_weight;
        similarity += get_word_occurence_similarity(question) * word_occurence_weight;
        similarity += get_word_position_similarity(question) * word_position_weight;
    }

    return Math.round(similarity);
}

function get_word_occurence_similarity(question)
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

function get_word_position_similarity(question)
{
    var similarity = 100;

    var question_words = question.split(" ");
    var query_words = query.split(" ");

    var decrement = similarity / question_words.length;
    for (var i = 0; i < question_words.length; i++)
    {
        if (question_words[i] !== query_words[i])
        {
            similarity -= decrement;
        }
    }

    return similarity;
}

function get_character_occurence_similarity(question)
{
    var similarity = 100;

    var question_characters = [];
    for (var i = 0; i < question.length; i++)
    {
        var character = question.charAt(i);        
        if (question_characters.indexOf(character) === -1)
        {
            question_characters.push(character);
        }
    }

    var decrement = similarity / question_characters.length;
    question_characters.forEach(function(character)
    {
        if (query.indexOf(character) === -1)
        {
            similarity -= decrement;
        }
    });

    return similarity;
}

function get_character_position_similarity(question)
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

function get_string_length_similarity(question)
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