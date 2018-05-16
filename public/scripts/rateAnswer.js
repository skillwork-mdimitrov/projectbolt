function loadAnswers()
{
    console.log("Sending request");
    $.getJSON( "rating/get-all-answers", function() {})
    .done(function(data) {
        console.log("Request complete");
        $.each( data, function( key, val ) {
            $('#answerSelector').append($('<option>', { 
                value: val["ID"],
                text : val["Answer"] 
            })); 
        });
    })
    .fail(function() {
          console.log( "error");
    }) 
}

function loadUsers()
{
    console.log("Sending request");
    $.getJSON( "rating/get-all-users", function() {})
    .done(function(data) {
        console.log("Request complete");
        $.each( data, function( key, val ) {
            $('#userSelector').append($('<option>', { 
                value: val["ID"],
                text : val["FirstName"] 
            }));  
        });
    })
    .fail(function() {
          console.log( "error");
    }) 
}

$(document).ready(function(){
    $('#answerSelector').change(function() {
        $('#ratingSelector').rating('clear rating');
    });

    $('#userSelector').change(function() {
        $('#ratingSelector').rating('clear rating');
    });

    //Add event listener for star rating
    $('#ratingSelector').on("click", function(){
      rateAnswer();
    });

    // Ititialising the rating widgets
    $(".rating").rating({
        initialRating: 0,
        maxRating: 5,
        clearable: true
    });

    loadAnswers();
    loadUsers();
});

function rateAnswer()
{
    var answerID = $('#answerSelector').val();
    var userID = $('#userSelector').val();
    var rating = $('#ratingSelector').rating('get rating');

    if (answerID !== null && userID !== null && rating > 0)
    {
        console.log("Sending request");
        $.get( "rating/insert-rating/"+answerID+"/"+userID+"/"+rating, function() {})
        .done(function() {
            console.log("Request complete");
        })
        .fail(function() {
            console.log( "error");
        }) 

        $('#answerSelector option:first').prop('selected',true);
        $('#userSelector option:first').prop('selected',true);
        $('#ratingSelector').rating('clear rating');
    }
}