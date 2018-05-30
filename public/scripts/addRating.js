const addRating = function() {
    const rateAnswer = function rateAnswer(ratingElement) {
        let answerID = ratingElement.attr("id");
        let rating = $('#'+answerID).rating('get rating');
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        let ratingData = {
            "answerID": answerID,
            "rating": rating,
            "sessionID": sessionID
        };

        console.log("Checking if rating exists on answerID " + answerID);          
        $.getJSON("rating/get-rating-answer-user/"+answerID+"/"+sessionID, function () {})
        .done(function (data) {
            console.log("Rating check complete on answerID " + answerID);

            if (data.length > 0) {
                console.log("Requesting update rating on answerID " + answerID);
                $.post("rating/update-rating", ratingData, function() {})
                .done(function() {
                    unfoldingHeader.unfoldHeader("Rating successful", "green", true);
                    viewRatings.updateRating(ratingElement);
                })
                .fail(function(message) {
                    console.log("Updating rating failed on answerID " + answerID + ": " + message);   
                });
                }
            else {
                console.log("Requesting insert rating on answerID " + answerID);
                $.post("rating/insert-rating", ratingData, function() {})
                .done(function() {
                    unfoldingHeader.unfoldHeader("Rating successful", "green", true);
                    viewRatings.updateRating(ratingElement);
                })
                .fail(function() {
                    console.log("Inserting rating failed on answerID " + answerID + ": " + message);   
                });
            }
        })
        .fail(function (message) {
            console.log("Rating check failed on answerID " + answerID + ": " + message);   
        })
    };

    return {
        rateAnswer: rateAnswer
    }
}();