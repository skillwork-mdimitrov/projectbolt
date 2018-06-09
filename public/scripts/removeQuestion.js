/* removeQuestions NAMESPACE
 ============================================================== */
 const removeQuestion = function() {
    const scriptFilename = "removeQuestion.js";

    const removeQuestion = function(deleteButton) {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        let questionID = deleteButton.attr("id");

        let removeQuestionPromise = $.post("questions/remove-question", { questionID: questionID, sessionID: sessionID });
        global.logPromise(removeQuestionPromise, scriptFilename, "Requesting removal of question");

        global.showLoader();
        removeQuestionPromise.then(() => {
            viewQuestions.reloadQuestions().then(() => {
                global.hideLoader();
                unfoldingHeader.unfoldHeader("Removed question successfully", "green"); 
            }).catch(() => {
                global.hideLoader();
                unfoldingHeader.unfoldHeader("Failed reloading questions", "red");
            });
        }).catch(() => {
            global.hideLoader();
            unfoldingHeader.unfoldHeader("Failed removing question", "red");   
        });
    };
  
    // addQuestion namespace will reveal the following properties
    return {
        removeQuestion: removeQuestion
    }
}();