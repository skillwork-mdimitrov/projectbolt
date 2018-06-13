/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6*/
/*jslint devel: true*/
/*globals unfoldingHeader, global, $, URLSearchParams, removeAnswer, viewRatings, addRating, addAnswer, redirectToIndex:false*/

/* viewAnswers NAMESPACE
 ============================================================== */
const viewAnswers = function() {
    "use strict";
    // DOM selectors
    const addOwnAnswerBtn = $('#addOwnAnswerBtn');
    const addAnswerContainer = $('#addAnswerContainer');
    const addAnswerArea = $('#addAnswerArea');
    const submitAnswerBtn = $('#submitAnswerBtn');
    const cancelAnswerBtn = $('#cancelAnswerBtn');

    // Make the answers table with the heading columns
    const mkAnswersTableSkeleton = function() {

      /* CREATES
      ============================================================== */

      // The answers table that will hold every row
      const answersTable = document.createElement("div");
      answersTable.setAttribute("id", "answersTable");
      answersTable.setAttribute("class", "Table");

      // Table headers
      const tableHeader = document.createElement("div");
      tableHeader.setAttribute("class", "Table-row Table-header");

      // Delete/Verify answers column
      const deleteAnswersColumn = document.createElement("div");
      deleteAnswersColumn.setAttribute("class", "Table-row-item u-Flex-grow1 deleteColumn");
      deleteAnswersColumn.textContent = "Action";

      // Answers column
      const answersColumn = document.createElement("div");
      answersColumn.setAttribute("class", "Table-row-item u-Flex-grow9");
      answersColumn.textContent = "Answer";

      // User column
      const userColumn = document.createElement("div");
      userColumn.setAttribute("class", "Table-row-item u-Flex-grow1");
      userColumn.textContent = "User";

      // Ratings column
      const ratingsColumn = document.createElement("div");
      ratingsColumn.setAttribute("class", "Table-row-item u-Flex-grow1");
      ratingsColumn.textContent = "Rating";

      /* APPENDS
      ============================================================== */

      // Append the delete, the answer, the user and rating columns to the table header
      tableHeader.appendChild(deleteAnswersColumn);
      tableHeader.appendChild(answersColumn);
      tableHeader.appendChild(userColumn);
      tableHeader.appendChild(ratingsColumn);

      // Append that table header to the answers table
      answersTable.appendChild(tableHeader);

      // Append that answers table to the main container
      document.getElementById("mainContainer").appendChild(answersTable);

      return true;
    };

    const addToTable = function(answer) {
        let answerText = answer[0];
        let answerID = answer[1];
        let username = answer[2];
        let verified = answer[3];

        // Select the table to append rows to
        const answersTable = document.getElementById("answersTable");

        /* CREATES
        ============================================================== */

        // A row with a delete button, answer, user and rating.
        const tableRow = document.createElement("div");
        tableRow.setAttribute("class", "Table-row");

        /* DELETES
        ============================================================== */
        // The delete div
        const rowItemDelete = document.createElement("div");
        rowItemDelete.setAttribute("class", "Table-row-item u-Flex-grow1 deleteColumn");
        rowItemDelete.setAttribute("data-header", "Action");

        // The delete div style
        rowItemDelete.style.display = "flex";
        rowItemDelete.style.justifyContent = "center";
        rowItemDelete.style.alignContent = "center";
        // ============================================================== */

        // The delete button
        const rowItemDeleteButton = document.createElement("button");
        rowItemDeleteButton.setAttribute("class", "deleteButton fa fa-close");
        rowItemDeleteButton.setAttribute("title", "Delete");
        rowItemDeleteButton.setAttribute("id", answerID);
        rowItemDelete.appendChild(rowItemDeleteButton);

        // The verify button
        const rowItemVerifyButton = document.createElement("button");
        rowItemVerifyButton.setAttribute("class", "verifyButton fa fa-check");
        rowItemVerifyButton.setAttribute("title", "Verify");
        rowItemVerifyButton.setAttribute("id", answerID);

        //append to row
        rowItemDelete.appendChild(rowItemDeleteButton);
        if(!verified){
          rowItemDelete.appendChild(rowItemVerifyButton);
        }

        // The answer
        const rowItemAnswer = document.createElement("div");
        rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
        rowItemAnswer.setAttribute("data-header", "Answer");

        //TO DO:: Add verified icon before the text
        if(verified){
          rowItemAnswer.textContent = "Verified Answer: " + answerText;
        }
        else{
          rowItemAnswer.textContent = answerText;
        }


        // The user
        const rowUser = document.createElement("div");
        rowUser.setAttribute("class", "Table-row-item u-Flex-grow1");
        rowUser.setAttribute("data-header", "User");
        rowUser.textContent = username;

        // The rating
        const rowItemRating = document.createElement("div");
        rowItemRating.setAttribute("class", "star ui rating Table-row-item u-Flex-grow1");
        rowItemRating.setAttribute("data-header", "Rating");
        rowItemRating.setAttribute("id", answerID);

        /* APPENDS
        ============================================================== */

        // Append the delete button, verify button, answer, user and rating to that table row
        tableRow.appendChild(rowItemDelete);
        tableRow.appendChild(rowItemAnswer);
        tableRow.appendChild(rowUser);
        tableRow.appendChild(rowItemRating);

        // Append the row to the table
        answersTable.appendChild(tableRow);

        return true;
    };

    // Remove the answers table from the DOM
    const rmAnswersTable = function() {
      const answersTable = document.getElementById("answersTable");
      answersTable.parentNode.removeChild(answersTable);

      return true;
    };

    // UI section for posting answers
    const addOwnAnswer = function() {
        const toggleContainer = () => new Promise(resolve =>
          addAnswerContainer.toggle("slow", resolve)
        );

        const toggleButtons = () => new Promise(resolve => {
          submitAnswerBtn.toggle("slow");
          cancelAnswerBtn.toggle("slow", resolve);
        });

        const changeText = function() {
          if( addAnswerContainer.is(":hidden") ) {
            addOwnAnswerBtn.text("Add your own answer" );
          }
          else {
            addOwnAnswerBtn.text("Hide adding answer");
          }
        };

        const toggleUI = () => new Promise(function (resolve) {
          toggleContainer();
          toggleButtons()
              .then(changeText)
              .then((function(){resolve("answers UI toggled")}))
        });

        return {
          toggleUI: toggleUI
        };
    }(); // Immediately invoked

    // Grab the question id from the URL
    const getQuestionID = function() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlEntries = urlParams.entries();
      let questionID = "";

      for(let pair of urlEntries) {
        if (pair[0] === "qid")
        {
          questionID = pair[1];
        }
      }
      return questionID;
    };

    // AJAX get all answers request + not only
    const getAnswers = function() {
      return new Promise(function(resolve, reject) {
        let questionID = getQuestionID();
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        $.getJSON( "answers/"+questionID+"/"+sessionID, function() {})
        .done(function(data) {
          console.log("Request complete");
          $.each( data, function( key, val ) {
            // First element contains the question text
            if (key === 0) {
              document.getElementById("questionHeading").textContent = val["Question"];
            }
            else {
              viewAnswers.addToTable([val["Answer"], val["ID"], val["Username"], val["Verified"]]);
            }
          });

          $.getJSON("questions/get-userid/"+questionID+"/"+sessionID, function () {})
          .done(function (questionUserID) {
            $.get("login/get-userID/"+sessionID, function () {})
            .done(function (userID) {
              if (questionUserID !== parseInt(userID)) {
                $("#addAnswerInput").css("display", "block");
              }
              $(".deleteColumn").css("display", "none");
              $.getJSON("login/is-teacher/"+sessionID, function () {})
              .done(function (isTeacher) {
                if (isTeacher) {
                    $(".deleteColumn").css("display", "block");
                }

                $('.deleteButton').on("click", function(){
                    global.showLoader();
                    removeAnswer.removeAnswer($(this));
                });

                $('.verifyButton').on("click", function(){
                  global.showLoader();
                  verifyAnswer.verifyAnswer($(this));
                });

                $('.ui.rating').on("click", function(){
                  addRating.rateAnswer($(this));
                });

                $('.ui.rating').rating({
                  maxRating: 5
                });

                viewRatings.updateAllRatings().then(function() {
                  resolve("Answers arrived"); // All answers arrived, resolve the promise
                })
                .catch(function() {
                  reject();
                });
                
              })
              .fail(function () {
                reject("error");
              });                  
            })
            .fail(function () {
              reject("error");
            });
          })
          .fail(function () {
            reject("error");
          });              
        })
        .fail(function(jqXHR) {
          global.logAJAXErr(getAnswers.name, jqXHR);
          unfoldingHeader.unfoldHeader("Failed to obtain the answers. Apologies :(", "orange");
          reject(`Failed to fetch answers for ↓ \n questionID: ${questionID}, sessionID: ${sessionID}`);
        });
      });
    };

    // Visually manipulate the answers table
    const answersTableUI = function() {
      const table = document.getElementById("answersTable");

      const hide = () => table.style.visibility = "hidden";
      const show = () => table.style.visibility = "visible";
      const fadeIn = () => table.style.opacity = "1";

      return {
        hide: hide,
        show: show,
        fadeIn: fadeIn
      };
    }; // NOT IIFE;

    // Made publicly available
    return {
       // DOM elements that need to be accessed outside the namespace
        addOwnAnswerBtn: addOwnAnswerBtn,
        submitAnswerBtn: submitAnswerBtn,
        cancelAnswerBtn: cancelAnswerBtn,
        addAnswerArea: addAnswerArea,

        // Functions
        mkAnswersTableSkeleton: mkAnswersTableSkeleton,
        addToTable: addToTable,
        rmAnswersTable: rmAnswersTable,
        addOwnAnswer: addOwnAnswer, // return functions
        getQuestionID: getQuestionID,
        getAnswers: getAnswers,
        answersTableUI: answersTableUI // execute first to get the functions
    };
}();

$(document).ready(function() {
    "use strict";

    let loginCheckPromise = loginCheck.checkLogin();
    let loadNavigationPromise = navigation.loadNavigation();
    let initNotificationsPromise = notifications.initNotifications();

    Promise.all([loginCheckPromise, loadNavigationPromise, initNotificationsPromise]).then(() => {
      viewAnswers.addOwnAnswerBtn.on("click", function(){
        viewAnswers.addOwnAnswer.toggleUI();
      });

      viewAnswers.submitAnswerBtn.on("click", function() {
        const buttonID = this.id; // for logging purposes
        $.ajax({
          type: 'get',
          url: 'login/get-userID/'+sessionStorage.getItem('projectBoltSessionID'),
          // Session check AJAX request
          success: function (userID) {
            if(global.fieldNotEmpty(viewAnswers.addAnswerArea)) {
              global.showLoader();
              // JSON'ize the question
              let bodyJSON = {
                question: document.getElementById("questionHeading").textContent,
                questionID: viewAnswers.getQuestionID(),
                answer: viewAnswers.addAnswerArea.val(),
                userID: parseInt(userID),
                sessionID: sessionStorage.getItem('projectBoltSessionID')
              };

              // Send post answer AJAX request
              addAnswer.postAnswer(bodyJSON).then(function() {
                /* UI
                ============================================================== */
                global.hideLoader();
                viewAnswers.addOwnAnswer.toggleUI().then(function() {
                  viewAnswers.addAnswerArea.val(''); // Reset textarea
                  /* RE-FETCH all the answers
                  ============================================================== */
                  viewAnswers.rmAnswersTable(); // Remove the answers table from the DOM (so it can be recreated)
                  viewAnswers.mkAnswersTableSkeleton(); // Create a new answers table
                  viewAnswers.answersTableUI().hide();
                  global.showLoader();
                  // Populate the answers table again (with the new answers)
                  viewAnswers.getAnswers().then(function() {
                    // When answers arrive animate them in
                    global.hideLoader();
                    viewAnswers.answersTableUI().show();
                    viewAnswers.answersTableUI().fadeIn();
                  })
                })
                // ============================================================== */
                .catch(function(reject) {
                  console.log(`getAnswers promise got rejected, reject message: ↓ \n ${reject}`);
                  global.hideLoader();
                });
              })
              .catch(function(reject) {
                console.log(`postAnswer promise got rejected, reject message: ↓ \n ${reject}`);
                global.hideLoader();
              });            
            }
            else {
              unfoldingHeader.unfoldHeader("Please fill in an answer", "red");
            }
          },
          error: function (jqXHR) {
            unfoldingHeader.unfoldHeader('Invalid session, please logout and login again. Apologies :(', "red");
            global.logAJAXErr(buttonID, jqXHR);
          }
        });
      });

      /* Cancel submitting answer button
      ============================================================== */
      viewAnswers.cancelAnswerBtn.on("click", function() {
        viewAnswers.addAnswerArea.val(''); // Reset textarea
        viewAnswers.addOwnAnswer.toggleUI();
      });

      console.log("Sending get answers request");

      /* The initial build and population of the Answers table
      ============================================================== */
      viewAnswers.mkAnswersTableSkeleton(); // Create the answers table skeleton
      // Populate the answers table
      viewAnswers.getAnswers().then(function() {
        // Animate-in the newly arrived answers
        global.hideLoader();        
        viewAnswers.answersTableUI().fadeIn();
        return true;
      })
      .catch(function(reject) {
        console.log(`getAnswers promise got rejected, reject message: ↓ \n ${reject}`);
        return false;
      });
      // ============================================================== */
    })
    // Promise.all catch
    .catch(() => {
      unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
      setTimeout(function(){ global.logout(); }, 5000);
    });
});