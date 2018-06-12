/* removeAnswer NAMESPACE
============================================================== */
const removeAnswer = function() {
    const removeAnswer = function(deleteButton) {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        let answerID = deleteButton.attr("id");

        console.log("Removing answer " + answerID);
        $.post("answers/remove-answer", { answerID: answerID, sessionID: sessionID }, function() {})
        .done(function() {
            unfoldingHeader.unfoldHeader("Removed successfully", "green", true);
            /* RE-FETCH all the answers
            ============================================================== */
            viewAnswers.rmAnswersTable(); // Remove the answers table from the DOM (so it can be recreated)
            viewAnswers.mkAnswersTableSkeleton(); // Create a new answers table
            viewAnswers.answersTableUI().hide();
            global.showLoader();
            // Populate the answers table again (with the new answers)
            viewAnswers.getAnswers().then(function() {
                // When answers arrive animate them in                
                viewAnswers.answersTableUI().show();
                global.hideLoader();
                viewAnswers.answersTableUI().fadeIn();
            })
            .catch(function(message) {
                unfoldingHeader.unfoldHeader("Failed retrieving answers, see console for details", "red");   
                console.log("Failed retrieving answers " + answerID + ": " + message);
            });
        })
        .fail(function(message) {
            unfoldingHeader.unfoldHeader("Failed removing answer, see console for details", "red");  
            console.log("Failed removing answer " + answerID + ": " + message.responseText);
        });
    };

    // addAnswer namespace will reveal the following properties
    return {
        removeAnswer: removeAnswer
    }
}();