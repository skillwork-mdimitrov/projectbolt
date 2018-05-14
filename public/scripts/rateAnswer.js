function loadAnswers()
{
    "use strict";
    $.ajax({
      type: 'GET',
      url: 'fetchAllAnswers',
      success: function(data){
        // // the results from this request will be stored in the questions variable.
        // // since the results coming from the AJAX request are as string, split by coma first and then store in array
        // vq.questions = data.split(",");
        // vq.outsideResolve(vq.questions);
        $.each(data, function (index, value) {
            $('#answerSelector').append($('<option>', { 
                value: value["id"],
                text : value["answer"] 
            }));            
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
        console.log('jqXHR: ' + jqXHR);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown);
      }
    }); 
}

function loadUsers()
{
    "use strict";
    $.ajax({
      type: 'GET',
      url: 'fetchAllUsers',
      success: function(data){
        // // the results from this request will be stored in the questions variable.
        // // since the results coming from the AJAX request are as string, split by coma first and then store in array
        // vq.questions = data.split(",");
        // vq.outsideResolve(vq.questions);
        $.each(data, function (index, value) {
            $('#userSelector').append($('<option>', { 
                value: value["id"],
                text : value["firstname"] 
            }));         
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
        console.log('jqXHR: ' + jqXHR);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown);
      }
    }); 
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
    setTimeout(function() {
        loadUsers();
    }, 2000);    
});

$(".rating").change(function() {
    alert( "Handler for .change() called." );
});

function rateAnswer()
{
    var answerID = $('#answerSelector').val();
    var userID = $('#userSelector').val();
    var userName = $('#userSelector option:selected').text();
    var rating = $('#ratingSelector').rating('get rating');

    if (answerID !== null && userID !== null && rating > 0)
    {
        "use strict";
        $.ajax({
            type: 'post',
            data: {"answer" : answerID, "user": userID, "rating": rating},
            url: 'request_writing_rating_todb',
            success: function(data){
                console.log("Rating entered: " + userName + " rated " + rating);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
                console.log('jqXHR: ' + jqXHR);
                console.log('textStatus: ' + textStatus);
                console.log('errorThrown: ' + errorThrown);
            }
        });
        
        $('#answerSelector option:first').prop('selected',true);
        $('#userSelector option:first').prop('selected',true);
        $('#ratingSelector').rating('clear rating');
    }    
}