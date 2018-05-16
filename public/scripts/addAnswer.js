/* addAnswers NAMESPACE
 ============================================================== */
const aa = function() {
  let answerButton = $('#answerButton');
  let answerBox = $('#answerBox');
  let questionIDBox = $('#questionIDBox');

  // aa namespace will reveal the following properties
  return {
    answerButton: answerButton,
    answerBox: answerBox,
    questionIDBox: questionIDBox
  }
}();

function postAnswer(bodyJSON){
  "use strict";
  $.ajax({
    type: 'POST',
    data: bodyJSON,
    url: 'add-answer',
    success: function(data){
      alert('Answer added successfully for question ' + aa.questionIDBox.val());
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
      console.log('jqXHR: ' + jqXHR);
      console.log('textStatus: ' + textStatus);
      console.log('errorThrown: ' + errorThrown);
    }
  });
}

function fieldsValidation() {
  if(aa.answerBox.val().length > 0 && aa.questionIDBox.val().length > 0) {
    return true;
  }
}

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  aa.answerButton.on("click", function() {
    if(fieldsValidation()) {
      // JSON'ize the answer and questionID
      let bodyJSON = {
        questionID: aa.questionIDBox.val(),
        answer: aa.answerBox.val()
      };

      // Send the AJAX request
      postAnswer(bodyJSON);
    }
    else {
      alert('Please write an answer and question id in the appropriate fields')
    }
  });
});
