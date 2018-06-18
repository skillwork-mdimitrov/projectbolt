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
      let bestAnswerSimilarityPromise = suggestions.getBestAnswerSimilarity(bodyJSON.answer, bodyJSON.questionID);

      bestAnswerSimilarityPromise.then((bestAnswerSimilarity) => {
        if (bestAnswerSimilarity.rating < suggestions.maximumAnswerSimilarity) {
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
              resolve();
            }).catch(() => {
              unfoldingHeader.unfoldHeader("Failed retrieving question user id", "red");
              reject();
            });
          }).catch(() => {
            unfoldingHeader.unfoldHeader("Failed adding new answer", "red");        
            reject();
          });
        }
        else {
          unfoldingHeader.unfoldHeader("Similar answer already exists: " + bestAnswerSimilarity.target, "orange");        
          reject();
        }        
      }).catch(() => {
        unfoldingHeader.unfoldHeader("Failed retrieving answer similarity ratings", "red");
        reject();
      });      
    });
  };

  return {
    postAnswer: postAnswer
  };
}();