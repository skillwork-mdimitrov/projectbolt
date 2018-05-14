// Select the Box and button
let answerButton = $('#answerButton');
let answerBox = $('#answerBox');
let questionID = 1;

//Request to run an SQL query on the database from the server to add new answers
function ajaxRequest(answerAsString){
  "use strict";
  $.ajax({
    type: 'post',
    data: {"answer" : answerAsString, "questionID" : questionID},
    url: 'dynamic_request_writeToDB',
    success: function(data){
      console.log("data written");
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
      console.log('jqXHR: ' + jqXHR);
      console.log('textStatus: ' + textStatus);
      console.log('errorThrown: ' + errorThrown);
    }
  });
}



// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  answerButton.on("click", function() {
    ajaxRequest(answerBox.val());

  });
});