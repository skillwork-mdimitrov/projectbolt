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
        unfoldingHeader.unfoldHeader(data, "green");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        unfoldingHeader.unfoldHeader('It is not allowed to insert the same question', "orange");
        console.log('jqXHR: ' + jqXHR);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown);
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
//  ============================================================== */

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  addQuestion.submitQuestionBtn.on("click", function() {
    if(global.fieldNotEmpty(addQuestion.questionBox)) {
      let sessionID = sessionStorage.getItem('projectBoltSessionID');
      // Get UserID
      $.ajax({
        type: 'get',
        url: 'login/get-userID/' + sessionID,
        success: function (data) {
          // JSON'ize the question
          let questionJSON = {
            question: addQuestion.questionBox.val(),
            userID: data.userID,
            sessionID: sessionID
          };
          // Send the AJAX request
          addQuestion.submitQuestion(questionJSON);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange");
          console.log('jqXHR: ' + jqXHR);
          console.log('textStatus: ' + textStatus);
          console.log('errorThrown: ' + errorThrown);
        }
      });
    }
    else {
      unfoldingHeader.unfoldHeader("Please fill in a question", "red");
    }
  })
});