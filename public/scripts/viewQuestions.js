/* viewQuestions NAMESPACE
 ============================================================== */
const viewQuestions = function () {
  const addToTable = function (question) {
    let questionText = question[0];
    let questionUser = question[1];
    let questionID = question[2];

    let questionsTable = document.getElementById("questionsTable");

    // A row with a delete button, question, user and answers
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    // The delete button
    let rowItemDelete = document.createElement("div");
    rowItemDelete.setAttribute("class", "Table-row-item u-Flex-grow1 deleteColumn");
    rowItemDelete.setAttribute("data-header", "Action");
    let rowItemDeleteButton = document.createElement("button");
    rowItemDeleteButton.setAttribute("class", "deleteButton");
    rowItemDeleteButton.setAttribute("id", questionID);
    rowItemDeleteButton.textContent = "Delete";
    rowItemDelete.appendChild(rowItemDeleteButton);

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

    // Append the delete button, question, user and answer to that table row
    tableRow.appendChild(rowItemDelete);
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

/* Delete button
============================================================== */

$(document).ready(function () {
  let sessionID = sessionStorage.getItem('projectBoltSessionID');

  console.log("Sending request");
  $.getJSON("questions/get-all-questions/"+sessionID, function () {})
  .done(function (data) {
    console.log("Request complete");
    $.each(data, function (key, val) {
      viewQuestions.addToTable([val["Question"], val["Username"], val["ID"]]);
    });

    $(".deleteColumn").css("display", "none");
    $.getJSON("login/is-teacher/"+sessionID, function () {})
    .done(function (isTeacher) {
        if (isTeacher) {
          $(".deleteColumn").css("display", "block");
        }
        $('.deleteButton').on("click", function(){
          removeQuestion.removeQuestion($(this));
        });
    })
    .fail(function () {
        console.log("error");
    }) 
  })
  .fail(function () {
    console.log("Get all questions failed");
  })
});
