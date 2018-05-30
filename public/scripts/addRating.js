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

        console.log("Sending rating exists request");          
        $.getJSON("rating/get-rating-answer-user/"+answerID+"/"+sessionID, function () {})
        .done(function (data) {
            console.log("Request complete");
            console.log("Sending insert rating request");
            if (data.length > 0) {
            $.post("rating/update-rating", ratingData, function() {})
            .done(function() {
                console.log("complete");
                viewRatings.updateRatings(ratingElement);
            })
            .fail(function() {
                console.log( "error");
            });
            }
            else {
            $.post("rating/insert-rating", ratingData, function() {})
            .done(function() {
                console.log("complete");
                viewRatings.updateRatings(ratingElement);
            })
            .fail(function() {
                console.log( "error");
            });
            }
        })
        .fail(function () {
            console.log("error");
        })
    };

    return {
        rateAnswer: rateAnswer
    }
}();