const addRating = function() {
    const rateAnswer = function rateAnswer(ratingElement) {
        ratingElement.rating("disable");
        let answerID = ratingElement.attr("id");
        let rating = $("#"+answerID+".star").rating('get rating');
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
                    unfoldingHeader.unfoldHeader("Rating successful", "green");
                })
                .fail(function(message) {
                    unfoldingHeader.unfoldHeader("Failed updating rating, see console for details", "red");
                    console.log("Updating rating failed on answerID " + answerID + ": " + message.responseText);   
                })
                .always(function() {
                    viewRatings.updateRating(ratingElement);
                });
            }
            else {
                console.log("Requesting insert rating on answerID " + answerID);
                $.post("rating/insert-rating", ratingData, function() {})
                .done(function() {
                    unfoldingHeader.unfoldHeader("Rating successful", "green");
                })
                .fail(function(message) {
                    unfoldingHeader.unfoldHeader("Failed inserting rating, see console for details", "red");
                    console.log("Inserting rating failed on answerID " + answerID + ": " + message.responseText);   
                })                
                .always(function() {
                    viewRatings.updateRating(ratingElement);
                });              
            }
        })
        .fail(function (message) {
            unfoldingHeader.unfoldHeader("Failed checking rating, see console for details", "red");
            console.log("Rating check failed on answerID " + answerID + ": " + message.responseText);   
            ratingElement.rating("enable");
        })
    };

    return {
        rateAnswer: rateAnswer
    }
}();