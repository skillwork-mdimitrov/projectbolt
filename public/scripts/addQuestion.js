/* addQuestion NAMESPACE
 ============================================================== */
const addQuestion = function() {
  "use strict";
  const questionBox = $('#questionBox');
  const submitQuestionBtn = $('#submitQuestionBtn');
  const submitQuestion = function(question) {
    "use strict";
    $.ajax({
      type: 'post',
      data: question,
      url: 'questions/add-question',
      success: function(data){
        unfoldingHeader.unfoldHeader(data.response, "green");
        notifications.getNotificationSocket().emit('newQuestion', {question: data.question, questionID: data.questionID[0].ID});
      },
      error: function(jqXHR) {
        // If the server response includes "Violation of UNIQUE KEY"
        if(global.logAJAXErr(submitQuestion.name, jqXHR) === "duplicatedKey") {
          // The user is trying to add an already existing question
          unfoldingHeader.unfoldHeader("This question already exists", "orange");
        }
        // More general error
        else {
          unfoldingHeader.unfoldHeader("Failed to post your question. Apologies :(", "red");
        }
      }
    });
  };

  // addQuestion namespace will reveal the following properties
  return {
    questionBox: questionBox,
    submitQuestionBtn: submitQuestionBtn,
    submitQuestion: submitQuestion
  }
}();


// When everything has loaded
$(document).ready(function() {
  "use strict";

  let loginCheckPromise = loginCheck.checkLogin();
  let loadNavigationPromise = navigation.loadNavigation();
  let initNotificationsPromise = notifications.initNotifications();

  Promise.all([loginCheckPromise, loadNavigationPromise, initNotificationsPromise]).then(() => {
    addQuestion.submitQuestionBtn.on("click", function() {
      if(global.fieldNotEmpty(addQuestion.questionBox)) {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');
        // Get UserID
        $.ajax({
          type: 'get',
          url: 'login/get-userID/' + sessionID,
          success: function (userID) {
            // JSON'ize the question
            let questionJSON = {
              question: addQuestion.questionBox.val(),
              userID: parseInt(userID),
              sessionID: sessionID
            };
            // Send the AJAX request
            addQuestion.submitQuestion(questionJSON);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            unfoldingHeader.unfoldHeader('error', "orange");
            console.log('jqXHR: ' + jqXHR);
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);
          }
        });
      }
      else {
        unfoldingHeader.unfoldHeader("Please fill in a question", "orange");
      }
    })
    
    global.hideLoader();
    
  }).catch(() => {
    unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
    setTimeout(function(){ global.logout(); }, 5000);   
  }); 
});