/* viewQuestions NAMESPACE
 ============================================================== */
const viewQuestions = function () {
  const scriptFilename = "viewQuestions.js";
  const getAllQuestionsBtn = $("#getAllQuestionsBtn");
  const getTopQuestionsBtn = $("#getTopQuestionsBtn");
  let topQuestionsIDsArr = [];

  const extractTopQuestionIDs = (() => {
    getMostPopular.getMostPopularQuestions().then((data) => {
      for(let elem of data) {
        topQuestionsIDsArr.push(elem["ID"]);
      }
    })
  })(); // IIFE;

  const addToTable = function (question, isTopUser) {
    let questionText = question[0];
    let questionUser = question[1];
    let questionID = question[2];
    let questionsTable = document.getElementById("questionsTable");

    // A row with action , question, user and answers
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    /* Delete
    ============================================================== */
    // The delete div
    let rowItemDelete = document.createElement("div");
    rowItemDelete.setAttribute("class", "Table-row-item u-Flex-grow1 deleteColumn");
    rowItemDelete.setAttribute("data-header", "Action");

    // The delete div style
    rowItemDelete.style.display = "flex";
    rowItemDelete.style.justifyContent = "center";
    rowItemDelete.style.alignContent = "center";

    // The delete button
    let rowItemDeleteButton = document.createElement("button");
    rowItemDeleteButton.setAttribute("class", "deleteButton fa fa-close");
    rowItemDeleteButton.setAttribute("id", questionID);
    rowItemDelete.appendChild(rowItemDeleteButton);
    // ============================================================== */

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

    if(isTopUser) {
      let rowItemImg = document.createElement("img");
      rowItemImg.src = "images/topBadge.png";
      rowItemImg.style.height = "20px";
      rowItemImg.alt = "Top user";
      // Add flex stuff here
      rowItemUser.appendChild(rowItemImg);
    }

    // The answers link
    let rowItemAnswer = document.createElement("div");
    rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemAnswer.setAttribute("data-header", "Answers");
    let rowItemAnswerLink = document.createElement("a");
    rowItemAnswerLink.textContent = "Answers";
    rowItemAnswerLink.title = "Answers";
    rowItemAnswerLink.href = "answers.html?qid=" + questionID;
    global.trackQuestionsVisited($(rowItemAnswerLink), questionID);
    rowItemAnswer.appendChild(rowItemAnswerLink);

    // Append the delete button, question, user and answer to that table row
    tableRow.appendChild(rowItemDelete);
    tableRow.appendChild(rowItemQuestion);
    tableRow.appendChild(rowItemUser);
    tableRow.appendChild(rowItemAnswer);

    // Append the row to the table
    questionsTable.appendChild(tableRow);
  };

  const reloadQuestions = function (topQuestionsOnly) {
    return new Promise((resolve, reject) => {
      // Remove all from the table except for the headers
      $(".Table-row:not(.Table-header)").remove();
      let sessionID = sessionStorage.getItem('projectBoltSessionID');

      let getAllQuestionsPromise = $.getJSON("questions/get-all-questions/"+sessionID);
      global.logPromise(getAllQuestionsPromise, scriptFilename, "Requesting all question data");

      let isTeacherPromise = $.get("login/is-teacher/"+sessionID);
      global.logPromise(isTeacherPromise, scriptFilename, "Requesting user teacher status");

      let isUserOfTheMonthPromise = userOfTheMonth.getUserOfTheMonth();
      global.logPromise(isUserOfTheMonthPromise, scriptFilename, "Requesting user of the month");

      Promise.all([getAllQuestionsPromise, isTeacherPromise, isUserOfTheMonthPromise]).then((values) => {
        let questionsData = values[0];      // Return value from getAllQuestionsPromise
        let isTeacher = values[1];          // Return value from isTeacherPromise
        let isUserOfTheMonth = values[2];   // Return value from isUserOfTheMonthPromise
        $.each(questionsData, function (key, val) {
          // Reload is for top questions only
          if(topQuestionsOnly) {
            if(topQuestionsIDsArr.includes(val["ID"])) {
              val["UserID"] === isUserOfTheMonth ?
                addToTable([val["Question"], val["Username"], val["ID"]], true): // is the user of the month
                addToTable([val["Question"], val["Username"], val["ID"]], false); // is not user of the month
            }
          }
          // Reload is for all questions
          else {
            val["UserID"] === isUserOfTheMonth ?
              addToTable([val["Question"], val["Username"], val["ID"]], true):
              addToTable([val["Question"], val["Username"], val["ID"]], false);
          }
        });

        $(".deleteColumn").css("display", "none");

        if (isTeacher) {
          $(".deleteColumn").css("display", "flex");
        }

        $('.deleteButton').on("click", function(){
          removeQuestion.removeQuestion($(this));
        });
        
        resolve();

      }).catch(() => {
        reject();
      })
    });
  };

  return {
    getAllQuestionsBtn: getAllQuestionsBtn,
    getTopQuestionsBtn: getTopQuestionsBtn,
    reloadQuestions: reloadQuestions,
  }
}();

$(document).ready(function () {
  "use strict";
  /* ATTACH EVENT LISTENERS
  ============================================================== */
  viewQuestions.getAllQuestionsBtn.on("click", () => {
    viewQuestions.reloadQuestions();
  });

  viewQuestions.getTopQuestionsBtn.on("click", () => {
    viewQuestions.reloadQuestions(true);
  });

  let loginCheckPromise = loginCheck.checkLogin();
  let loadNavigationPromise = navigation.loadNavigation();
  let initNotificationsPromise = notifications.initNotifications();

  Promise.all([loginCheckPromise, loadNavigationPromise, initNotificationsPromise]).then(() => {
    viewQuestions.reloadQuestions().then(() => {
      global.hideLoader();
    }).catch(() => {
      unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
      setTimeout(function(){ global.logout(); }, 5000);   
    }); 
  }).catch(() => {
    unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
    setTimeout(function(){ global.logout(); }, 5000);   
  }); 
});
