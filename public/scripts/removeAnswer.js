/* removeAnswer NAMESPACE
============================================================== */
const removeAnswer = function() {
    const removeAnswer = function(deleteButton) {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        let answerID = deleteButton.attr("id");

        $.post("answers/remove-answer", { answerID: answerID, sessionID: sessionID }, function() {})
            .done(function() {
                console.log("Request complete");
                window.location.reload();
            })
            .fail(function() {
                console.log( "error");
            });
    };

    // addAnswer namespace will reveal the following properties
    return {
        removeAnswer: removeAnswer
    }
}();