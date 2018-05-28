const viewRatings = function() {
    const updateAllRatings = function updateAllRatings() {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        $('.ui.rating').each(function( index ) {
            let answerID = $(this).attr("id");
            let ratingElement = $(this);

            $.getJSON( "rating/get-all-ratings/"+answerID+"/"+sessionID, function() {})
            .done(function(data) {
                console.log("Request complete");
                let totalRating = 0;
                let ratingCount = data.length;
                $.each( data, function( key, val ) {
                    totalRating += val["Rating"];
                });
                averageRating = Math.ceil(totalRating / ratingCount);
                ratingElement.rating('set rating', averageRating);
            })
            .fail(function() {
                console.log( "error");
            })
        });
    };

    const updateRatings = function updateRatings(ratingElement) {
        let answerID = ratingElement.attr("id");
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        $.getJSON( "rating/get-all-ratings/"+answerID+"/"+sessionID, function() {})
        .done(function(data) {
            console.log("Request complete");
            let totalRating = 0;
            let ratingCount = data.length;
            $.each( data, function( key, val ) {
                totalRating += val["Rating"];
            });
            averageRating = Math.ceil(totalRating / ratingCount);
            ratingElement.rating('set rating', averageRating)
        })
        .fail(function() {
            console.log( "error");
        })
    };

    return {
        updateAllRatings: updateAllRatings,
        updateRatings: updateRatings
    }
}();