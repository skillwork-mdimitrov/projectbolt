function addToTable(answer) {
    let answerText = answer[0];

    let answersTable = document.getElementById("answersTable");

    // A row with a answer, user and answers
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    // The answer
    let rowItemAnswer = document.createElement("div");
    rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
    rowItemAnswer.setAttribute("data-header", "Answer");
    rowItemAnswer.textContent = answerText;

    // Append the answer, user and answer to that table row
    tableRow.appendChild(rowItemAnswer);

    // Append the row to the table
    answersTable.appendChild(tableRow);
}

$(document).ready(function() {
    console.log("Sending request");
    
    var urlParams = new URLSearchParams(window.location.search);
    var urlEntries = urlParams.entries();
    var questionID = "";
    for(pair of urlEntries) { 
        if (pair[0] === "qid")
        {
            questionID = pair[1]; 
        }        
    }
    
    $.getJSON( "answers/"+questionID, function() {})
    .done(function(data) {
          console.log("Request complete");
          $.each( data, function( key, val ) {
            // First element contains the question text
            if (key === 0)
            {
                document.getElementById("questionHeading").textContent = val["Question"];
            }
            else
            {
                addToTable([val["Answer"]]);
            }            
          });
        })
    .fail(function() {
          console.log( "error");
    }) 
});