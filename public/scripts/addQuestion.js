// To be prettified

let questionButton = $('#SubmitToYourQuestion');
let questionBox = $('#Questions1212');

function ajaxRequest(questionString){
  "use strict";
  $.ajax({
    type: 'post',
    data: {"question" : questionString, "type": "question"},
    url: 'dynamic_request_writeToDB',
    success: function(data){
      alert('Question added successfully');
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
  questionButton.on("click", function() {
    // ajaxRequest(questionBox.val());
    console.log("To be implemented");
  });
});