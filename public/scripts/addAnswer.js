/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6*/
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* addAnswer NAMESPACE
 ============================================================== */
const addAnswer = function() {
  "use strict";
  // AJAX post answer
  const postAnswer = function (bodyJSON){
    $.ajax({
      type: 'POST',
      data: bodyJSON,
      url: 'answers/add-answer',
      success: function(){
        console.log(`${postAnswer.name} says: Answer added successfully`);
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        $.getJSON("questions/get-userid/"+bodyJSON.questionID+"/"+sessionID, function () {})
        .done(function (data) {
          notifications.getNotificationSocket().emit('newAnswer', {question: bodyJSON.question, questionID: bodyJSON.questionID, userID: data[0].UserID});  
        })
        .fail(function (message) {
            unfoldingHeader.unfoldHeader("Failed retrieving question user id, see console for details", "red", true);
            console.log("Failed retrieving question user id: " + message.responseText);   
        })
      },
      error: function(jqXHR) {
        // If the server response includes "Violation of UNIQUE KEY"
        if(global.logAJAXErr(postAnswer.name, jqXHR) === "duplicatedKey") {
          // The user is trying to add an already existing answer
          unfoldingHeader.unfoldHeader("This answer already exists", "orange");
        }
        // More general error
        else {
          unfoldingHeader.unfoldHeader("Failed to post your answer. Apologies :(", "red");
        }
      }
    });
  };

  return {
    postAnswer: postAnswer
  };
}();