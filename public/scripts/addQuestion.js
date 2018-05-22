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
      url: 'add-question',
      success: function(data){
        unfoldingHeader.unfoldHeader(data, "green", true);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange", true);
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

    //Get UserID
    "use strict";
    $.ajax({
      type: 'get',
      data: {'SessionID': localStorage.getItem('projectBoltSessionID')},
      url: 'login//get-userID/',
      success: function (data) {

        // JSON'ize the question
        let questionJSON = {
          question: addQuestion.questionBox.val(),
          userID: data.UserID
        };
        // Send the AJAX request
        addQuestion.submitQuestion(questionJSON);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange", true);
        console.log('jqXHR: ' + jqXHR);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown);
      }
    });
  })
});