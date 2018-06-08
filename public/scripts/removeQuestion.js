/* removeQuestions NAMESPACE
 ============================================================== */
 const removeQuestion = function() {
    const removeQuestion = function(deleteButton) {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        let questionID = deleteButton.attr("id");
        
        $.post("questions/remove-question", { questionID: questionID, sessionID: sessionID }, function() {})
        .done(function() {              
            unfoldingHeader.unfoldHeader("Removed successfully", "green", true);  
            global.showLoader();         
            viewQuestions.reloadQuestions();              
        })
        .fail(function(message) {
            unfoldingHeader.unfoldHeader("Failed removing question, see console for details", "red", true);   
            console.log("Failed removing question " + questionID + ": " + message.responseText);
        });
    };
  
    // addQuestion namespace will reveal the following properties
    return {
        removeQuestion: removeQuestion
    }
}();