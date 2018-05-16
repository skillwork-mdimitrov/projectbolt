/* addQuestion NAMESPACE
 ============================================================== */
const aq = function() {
  "use strict";
  let questionBox = $('#questionBox');
  let submitQuestionBtn = $('#submitQuestionBtn');

  // aq namespace will reveal the following properties
  return {
    questionBox: questionBox,
    submitQuestionBtn: submitQuestionBtn
  }
}();

function submitQuestion(question) {
  "use strict";
  $.ajax({
    type: 'post',
    data: question,
    url: 'add-question',
    success: function(data){
      alert(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
      console.log('jqXHR: ' + jqXHR);
      console.log('textStatus: ' + textStatus);
      console.log('errorThrown: ' + errorThrown);
    }
  });
}

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  aq.submitQuestionBtn.on("click", function() {
    // JSON'ize the question
    let questionJSON = {
      question: aq.questionBox.val()
    };
    // Send the AJAX request
    submitQuestion(questionJSON);
  });
});