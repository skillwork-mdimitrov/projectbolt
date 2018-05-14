var answers = [
    "Yes",
    "No",
    "May be",
    "Ok"
]

var users = [
    "Hank",
    "Bob",
    "Alice",
    "Jerry",
    "John",
    "Diane"
]

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
            console.log(data);
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
    //Add event listener for star rating
    $('#ratingSelector').on("click", function(){
      rateAnswer();
      console.log("rated");
    });

    // Ititialising the rating widgets
    $(".rating").rating({
        initialRating: 0,
        maxRating: 5,
        clearable: true
    });

    loadAnswers();
    loadUsers();
    $.each(answers, function (index, value) {
        $('#answerSelector').append($('<option>', { 
            value: index,
            text : value 
        }));         
    });
    
    $.each(users, function (index, value) {
        $('#userSelector').append($('<option>', { 
            value: index,
            text : value 
        }));         
    });
});

$(".rating").change(function() {
    alert( "Handler for .change() called." );
});

function rateAnswer()
{
    var answerID = $('#answerSelector').val();
    var userID = $('#userSelector').val();
    var rating = $('#ratingSelector').rating('get rating');

    if (answerID !== null && userID !== null && rating > 0)
    {
        // "use strict";
        // $.ajax({
        //     type: 'post',
        //     data: {"answer" : answerID, "user": userID, "rating": rating},
        //     url: 'dynamic_request_writeToDB',
        //     success: function(data){
        //     console.log("data written");
        //     },
        //     error: function(jqXHR, textStatus, errorThrown) {
        //         alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
        //         console.log('jqXHR: ' + jqXHR);
        //         console.log('textStatus: ' + textStatus);
        //         console.log('errorThrown: ' + errorThrown);
        //     }
        // });

        query = "INSERT INTO ratings (answerid, userid, rating) VALUES (" + answerID + ", " + userID + ", " + rating + ")"
        console.log("Running query:");
        console.log(query);
        console.log("Resetting fields");
        $('#answerSelector option:first').prop('selected',true);
        $('#userSelector option:first').prop('selected',true);
        $('#ratingSelector').rating('clear rating');
    }    
}