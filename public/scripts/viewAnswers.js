/* viewAnswers NAMESPACE
 ============================================================== */
const viewAnswers = function() {
    const addToTable = function(answer) {
        let answerText = answer[0];
        let answerID = answer[1];
    
        let answersTable = document.getElementById("answersTable");
    
        // A row with a answer, user and answers
        let tableRow = document.createElement("div");
        tableRow.setAttribute("class", "Table-row");
    
        // The answer
        let rowItemAnswer = document.createElement("div");
        rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
        rowItemAnswer.setAttribute("data-header", "Answer");
        rowItemAnswer.textContent = answerText;

        // The rating
        let rowItemRating = document.createElement("div");
        rowItemRating.setAttribute("class", "star ui rating Table-row-item u-Flex-grow1");
        rowItemRating.setAttribute("data-header", "Rating");
        rowItemRating.setAttribute("id", answerID);
    
        // Append the answer, user and answer to that table row
        tableRow.appendChild(rowItemAnswer);
        tableRow.appendChild(rowItemRating);
    
        // Append the row to the table
        answersTable.appendChild(tableRow);
    };

    const rateAnswer = function rateAnswer(ratingElement) {
        let answerID = ratingElement.attr("id");
        let postData = {
            "answerID": answerID,
            "userID": 1,
            "rating": $('#'+answerID).rating('get rating')
        };        

        console.log("Sending request");
        $.post( "rating/insert-rating", postData, function() {})
        .done(function() {
            console.log("Request complete");
        })
        .fail(function() {
            console.log( "error");
        });
    };

    return {
        addToTable: addToTable,
        rateAnswer: rateAnswer
    }
}();
//  ============================================================== */

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
    
    if (questionID.length > 0)
    {
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
                    viewAnswers.addToTable([val["Answer"], val["ID"]]);
                }            
              });

              $('.ui.rating').on("click", function(){
                viewAnswers.rateAnswer($(this));
              });

              $('.ui.rating').rating({
                initialRating: 0,
                maxRating: 5
              });
            })
        .fail(function() {
              console.log( "error");
        }) 
    }
});