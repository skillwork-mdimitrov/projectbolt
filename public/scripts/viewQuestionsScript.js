/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* viewQuestionsScript NAMESPACE
 ============================================================== */
/* JS Module pattern to keep viewQuestionsScript's variables in the "vq" namespace
 * (Why do this? Because in the future, when we refer all our scripts from 1 index.html file, if we have the same global
 * variables, like outsideResolve (see compareScripts.js), they will overwrite each other. Now they wont) */
const vq = (function() {
  "use strict";
  // let questions = [];
  let questions = {};
  var outsideResolve; // will become dbDataLoaded's Promise.resolve
  var outsideReject; // will become dbDataLoaded's Promise.reject
  var dbDataLoaded = new Promise(function(resolve, reject) {
    outsideResolve = resolve;
    outsideReject = reject;
  });

  // vq namespace will reveal the following properties
  return {
    questions: questions,
    outsideResolve: outsideResolve,
    outsideReject: outsideReject,
    dbDataLoaded: dbDataLoaded
  };
})();
// =====================================================================================================================
function fetchAllQuestions() {
  "use strict";
  $.ajax({
    type: 'GET',
    url: 'fetchAllQuestions',
    success: function(data){
      // // the results from this request will be stored in the questions variable.
      // // since the results coming from the AJAX request are as string, split by coma first and then store in array
      // vq.questions = data.split(",");
      // vq.outsideResolve(vq.questions);
      vq.questions = data;
      vq.outsideResolve(vq.questions);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
      console.log('jqXHR: ' + jqXHR);
      console.log('textStatus: ' + textStatus);
      console.log('errorThrown: ' + errorThrown);
    }
  });
}

function fetchQuestionAnswer(whichQuestion) {
  "use strict";
  $.ajax({
    type: 'POST',
    url: 'fetchQuestionAnswer',
    data: whichQuestion,
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

// For each question, generate a row, with the question itself, the user that asked the question and the answers
let displayQuestions = function() {
  "use strict";
  let theTable = $('.Table')[0]; // since it's class selector, [0] is the first instance

  for(let element in vq.questions) {
    // A row with a question, user and answers
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    // The question
    let rowItemQuestion = document.createElement("div");
    rowItemQuestion.setAttribute("class", "Table-row-item u-Flex-grow9");
    rowItemQuestion.setAttribute("data-header", "Question");
    rowItemQuestion.textContent = vq.questions[element].question;

    // The user
    let rowItemUser = document.createElement("div");
    rowItemUser.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemUser.setAttribute("data-header", "User");
    rowItemUser.textContent = "Johny";

    // The answers link
    let rowItemAnswer = document.createElement("div");
    rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemAnswer.setAttribute("data-header", "Answers");
    rowItemAnswer.addEventListener("click", function() {
      let whichQuestion = {
        question: vq.questions[element].id
      };
      fetchQuestionAnswer(whichQuestion);
    });
    // Styles
    rowItemAnswer.style.textDecoration = "underline";
    rowItemAnswer.style.color = "blue";
    rowItemAnswer.textContent = "Answers";
    rowItemAnswer.style.cursor = "pointer";

    // Append the row to the table
    theTable.appendChild(tableRow);

    // Append the question, user and answer to that table row
    tableRow.appendChild(rowItemQuestion);
    tableRow.appendChild(rowItemUser);
    tableRow.appendChild(rowItemAnswer);
  }
};

// When everything has loaded
$(document).ready(function() {
  "use strict";
  fetchAllQuestions(); // send a request to fetch all the questions from the db
  vq.dbDataLoaded.then(function(resolve) {
    displayQuestions(); // when the questions arrive, generate and display them
  })
  .catch(function (error) {
    let caughtError = error.message; // if the promise returns an error, catch it
    console.log(caughtError);
  });
});