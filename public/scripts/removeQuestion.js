/* removeQuestions NAMESPACE
 ============================================================== */
 const removeQuestion = function() {
    const removeQuestion = function(deleteButton) {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        let questionID = deleteButton.attr("id");
        
        $.post("questions/remove-question", { questionID: questionID, sessionID: sessionID }, function() {})
        .done(function() {
            console.log("Request complete");
            window.location.reload();
        })
        .fail(function() {
            console.log( "error");
        });
    };
  
    // addQuestion namespace will reveal the following properties
    return {
        removeQuestion: removeQuestion
    }
}();