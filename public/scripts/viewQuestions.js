/* viewQuestions NAMESPACE
 ============================================================== */
const viewQuestions = function () {
  const addToTable = function (question) {
    let questionText = question[0];
    let questionUser = question[1];
    let questionID = question[2];

    let questionsTable = document.getElementById("questionsTable");

    // A row with a question, user and answers
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    // The question
    let rowItemQuestion = document.createElement("div");
    rowItemQuestion.setAttribute("class", "Table-row-item u-Flex-grow9");
    rowItemQuestion.setAttribute("data-header", "Question");
    rowItemQuestion.textContent = questionText;

    // The user
    let rowItemUser = document.createElement("div");
    rowItemUser.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemUser.setAttribute("data-header", "User");
    rowItemUser.textContent = questionUser;

    // The answers link
    let rowItemAnswer = document.createElement("div");
    rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemAnswer.setAttribute("data-header", "Answers");
    let rowItemAnswerLink = document.createElement("a");
    rowItemAnswerLink.textContent = "Answers";
    rowItemAnswerLink.title = "Answers";
    rowItemAnswerLink.href = "answers.html?qid=" + questionID;
    rowItemAnswer.appendChild(rowItemAnswerLink);

    // Append the question, user and answer to that table row
    tableRow.appendChild(rowItemQuestion);
    tableRow.appendChild(rowItemUser);
    tableRow.appendChild(rowItemAnswer);

    // Append the row to the table
    questionsTable.appendChild(tableRow);
  };

  return {
    addToTable: addToTable
  }
}();
//  ============================================================== */

$(document).ready(function () {
  console.log("Sending request");
  $.getJSON("questions/get-all-questions", function () {})
  .done(function (data) {
    console.log("Request complete");
    $.each(data, function (key, val) {
      viewQuestions.addToTable([val["Question"], "Hank", val["ID"]]);
    });
  })
  .fail(function () {
    console.log("error");
  })
});