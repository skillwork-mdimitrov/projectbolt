/* addAnswer NAMESPACE
 ============================================================== */
const addAnswer = function() {
  const answerButton = $('#answerButton');
  const answerBox = $('#answerBox');
  const questionIDBox = $('#questionIDBox');
  const postAnswer = function (bodyJSON){
    "use strict";
    $.ajax({
      type: 'POST',
      data: bodyJSON,
      url: 'add-answer',
      success: function(data){
        alert('Answer added successfully for question ' + addAnswer.questionIDBox.val());
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
        console.log('jqXHR: ' + jqXHR);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown);
      }
    });
  };
  const fieldsValidation = function() {
    if(addAnswer.answerBox.val().length > 0 && addAnswer.questionIDBox.val().length > 0) {
      return true;
    }
  };

  // addAnswer namespace will reveal the following properties
  return {
    answerButton: answerButton,
    answerBox: answerBox,
    questionIDBox: questionIDBox,
    postAnswer: postAnswer,
    fieldsValidation: fieldsValidation
  }
}();
//  ============================================================== */

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  addAnswer.answerButton.on("click", function() {
    if(addAnswer.fieldsValidation()) {
      // JSON'ize the answer and questionID
      let bodyJSON = {
        questionID: addAnswer.questionIDBox.val(),
        answer: addAnswer.answerBox.val()
      };

      // Send the AJAX request
      addAnswer.postAnswer(bodyJSON);
    }
    else {
      alert('Please write an answer and question id in the appropriate fields')
    }
  });
});
