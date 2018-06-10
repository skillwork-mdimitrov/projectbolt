/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6*/
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* addAnswer NAMESPACE
 ============================================================== */
const addAnswer = function() {
  "use strict";
  const scriptFilename = "addAnswer.js";

  // AJAX post answer
  const postAnswer = function (bodyJSON){
    return new Promise(function(resolve, reject) {
      let addAnswerPromise = $.post("answers/add-answer", bodyJSON);
      global.logPromise(addAnswerPromise, scriptFilename, "Requesting to add new answer");

      addAnswerPromise.then(() => {
        let questionUserIdPromise = $.get("questions/get-userid/"+bodyJSON.questionID+"/"+bodyJSON.sessionID);
        global.logPromise(questionUserIdPromise, scriptFilename, "Requesting user ID from question");
        let firstnamePromise = $.get("login/get-firstname/"+bodyJSON.sessionID);
        global.logPromise(firstnamePromise, scriptFilename, "Requesting user first name");

        Promise.all([questionUserIdPromise, firstnamePromise]).then((values) => {
          let questionUserID = parseInt(values[0]);   // Return value from questionUserIdPromise
          let firstname = values[1];                  // Return value from firstnamePromise

          notifications.notificationSocket.emit('newAnswer', {question: bodyJSON.question, 
                                                              questionID: bodyJSON.questionID, 
                                                              userID: questionUserID,
                                                              username: firstname});  
          
          unfoldingHeader.unfoldHeader("Answer added successfully", "green");
          resolve();
        }).catch(() => {
          unfoldingHeader.unfoldHeader("Failed retrieving question user id", "red");
          reject();
        });
      }).catch(() => {
        unfoldingHeader.unfoldHeader("Failed adding new answer", "red");        
        reject();
      });
    });
  };

  return {
    postAnswer: postAnswer
  };
}();