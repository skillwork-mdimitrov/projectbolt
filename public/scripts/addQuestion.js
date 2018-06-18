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
      global.showLoader(true);

      let userIdPromise = $.get("login/get-userID/"+sessionID);
      global.logPromise(userIdPromise, scriptFilename, "Requesting user ID");
      let bestQuestionSimilarityPromise = suggestions.getBestQuestionSimilarity(question);

      Promise.all([userIdPromise, bestQuestionSimilarityPromise]).then((values) => {
        let userID = parseInt(values[0]);             // Return value from userIdPromise
        let bestQuestionSimilarity = values[1];       // Return value from bestQuestionSimilarityPromise

        // If question is unique
        if (bestQuestionSimilarity.rating < suggestions.maximumQuestionSimilarity) {
          // JSON'ize the input to be send
          let questionData = {
            question: question,
            userID: userID,
            sessionID: sessionID
          };      
          
          let addQuestionPromise = $.post("questions/add-question", questionData);
          global.logPromise(addQuestionPromise, scriptFilename, "Requesting to add a question");
  
          addQuestionPromise.then((newQuestionData) => {
            let newQuestionIdPromise = $.post("questions/get-questionid", questionData);
            global.logPromise(newQuestionIdPromise, scriptFilename, "Requesting to add a question");

            newQuestionIdPromise.then((questionID) => {
              // Clear the input field
              questionBox.val("");
              global.hideLoader();
              addQuestion.questionBox.focus();
              unfoldingHeader.unfoldHeader("Question added successfully", "green");
              // Send a notification to all teachers
              notifications.notificationSocket.emit('newQuestion', {question: questionData.question, questionID: questionID});
            }).catch(() => { 
              questionBox.val("");
              global.hideLoader();
              addQuestion.questionBox.focus();
              unfoldingHeader.unfoldHeader("Failed retrieving new question ID", "red");
            });            
          }).catch(() => {
            global.hideLoader();
            addQuestion.questionBox.focus();
            unfoldingHeader.unfoldHeader("Failed adding question", "red");
          });
        }
        else {          
          let questionMatchIdPromise = $.post("questions/get-questionid", {question: bestQuestionSimilarity.target, sessionID: sessionID});
          global.logPromise(questionMatchIdPromise, scriptFilename, "Requesting question ID from similar match");

          questionMatchIdPromise.then((questionMatchId) => {
            unfoldingHeader.unfoldHeader("A similar question already exists: " + bestQuestionSimilarity.target, "orange", false, "answers.html?qid=" + questionMatchId);
          }).catch(() => {
            unfoldingHeader.unfoldHeader("Failed to retrieve question ID from similar match", "red");
          }).always(() => {
            global.hideLoader();
            addQuestion.questionBox.focus();
          });          
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
    suggestions.initAutoComplete();

    addQuestion.submitQuestionBtn.on("click", function() {
      addQuestion.submitQuestion();
    });

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