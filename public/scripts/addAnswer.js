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
    return new Promise(function(resolve, reject) {
      $.ajax({
        type: 'POST',
        data: bodyJSON,
        url: 'answers/add-answer',
        success: function(data){
          console.log(`${postAnswer.name} says: Answer added successfully`);
          unfoldingHeader.unfoldHeader(data.response, "green");
          let sessionID = sessionStorage.getItem('projectBoltSessionID');
          $.getJSON("questions/get-userid/"+bodyJSON.questionID+"/"+sessionID, function () {})
          .done(function (userID) {
            notifications.getNotificationSocket().emit('newAnswer', {question: bodyJSON.question, 
                                                                    questionID: bodyJSON.questionID, 
                                                                    userID: userID[0].UserID,
                                                                    username: data.username[0].FirstName});  
            resolve();
          })
          .fail(function (message) {
            unfoldingHeader.unfoldHeader("Failed retrieving question user id, see console for details", "red");
            console.log("Failed retrieving question user id: " + message.responseText);   
            reject();
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
          reject();
        }
      });
    });
  };

  return {
    postAnswer: postAnswer
  };
}();