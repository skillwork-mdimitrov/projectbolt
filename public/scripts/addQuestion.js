/* addQuestion NAMESPACE
 ============================================================== */
const addQuestion = function() {
  "use strict";
  const scriptFilename = "addQuestion.js";
  const questionBox = $('#questionBox');
  const submitQuestionBtn = $('#submitQuestionBtn');

  const submitQuestion = function() {
    if(global.fieldNotEmpty(addQuestion.questionBox)) {
      let sessionID = sessionStorage.getItem('projectBoltSessionID');
      let question = addQuestion.questionBox.val();
      global.showLoader();

      let userIdPromise = $.get("login/get-userID/"+sessionID);
      global.logPromise(userIdPromise, scriptFilename, "Requesting user ID");
      let questionWithinConstraintsPromise = suggestions.isWithinSimilarityConstraints(question);

      Promise.all([userIdPromise, questionWithinConstraintsPromise]).then((values) => {
        let userID = parseInt(values[0])            // Return value from userIdPromise
        let questionWithinConstraints = values[1]   // Return value from questionWithinConstraintsPromise

        if (questionWithinConstraints) {
          let questionData = {
            question: question,
            userID: userID,
            sessionID: sessionID
          };      
          
          let addQuestionPromise = $.post("questions/add-question", questionData)
          global.logPromise(addQuestionPromise, scriptFilename, "Requesting to add a question");
  
          addQuestionPromise.then((newQuestionData) => {
            // Clear the input field
            questionBox.val("");
            global.hideLoader();
            addQuestion.questionBox.focus();
            unfoldingHeader.unfoldHeader("Question added successfully", "green");
            notifications.getNotificationSocket().emit('newQuestion', {question: newQuestionData.question, questionID: newQuestionData.questionID});
          }).catch(() => {
            global.hideLoader();
            addQuestion.questionBox.focus();
            unfoldingHeader.unfoldHeader("Failed adding question", "red");
          });
        }
        else {
          global.hideLoader();
          addQuestion.questionBox.focus();
          unfoldingHeader.unfoldHeader("A similar question already exists", "orange");
        }        
      }).catch(() => {
        global.hideLoader();
        addQuestion.questionBox.focus();
        unfoldingHeader.unfoldHeader("An error ocurred", "red");
      });
    }
    else {
      unfoldingHeader.unfoldHeader("Please fill in a question", "orange");
    }
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
      addQuestion.submitQuestion();
    })

    addQuestion.questionBox.keyup(function(event) {
      if(event.keyCode === 13) {
        addQuestion.submitQuestion();
      }
    });
    
    global.hideLoader();
    addQuestion.questionBox.focus();
    
  }).catch(() => {
    unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
    setTimeout(function(){ global.logout(); }, 5000);   
  }); 
});