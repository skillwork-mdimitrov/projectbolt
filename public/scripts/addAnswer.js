console.log("hi!");
let answeButton = $('#answerButton');
let answerBox = $('#answerBox');

function ajaxRequest(){
    "use strict";
    $.ajax({
        type: 'GET',
        data: JSON.stringify(answerBox.value),
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
    answeButton.on("click", function() {
        console.log("clicked");
        ajaxRequest();

    });
});