/* viewAnswers, also addAnswers NAMESPACE
 ============================================================== */
const viewAnswers = function() {
    // DOM selectors
    const addOwnAnswerBtn = $('#addOwnAnswerBtn');
    const addAnswerContainer = $('#addAnswerContainer');
    const addAnswerArea = $('#addAnswerArea');
    const submitAnswerBtn = $('#submitAnswerBtn');
    const cancelAnswerBtn = $('#cancelAnswerBtn');

    /* Outside promise for resolving or rejecting answers arrival
    ============================================================== */
    var resolveAnswersArrived;
    var rejectAnswersArrived;
    var answersArrived = new Promise(function(resolve, reject) {
      resolveAnswersArrived = resolve;
      rejectAnswersArrived = reject;
    });
    // ============================================================== */

    // Since the new implementation calls addToTable many times, having a separate table instantiation is necessary
    const mkAnswersTableSkeleton = function(callback) {
      /* CREATES
      ============================================================== */

      // The answers table that will hold every row
      const answersTable = document.createElement("div");
      answersTable.setAttribute("id", "answersTable");
      answersTable.setAttribute("class", "Table");

      // Table headers
      const tableHeader = document.createElement("div");
      tableHeader.setAttribute("class", "Table-row Table-header");

      // Answers column
      const answersColumn = document.createElement("div");
      answersColumn.setAttribute("class", "Table-row-item u-Flex-grow9");
      answersColumn.textContent = "Answer";

      // Ratings column
      const ratingsColumn = document.createElement("div");
      ratingsColumn.setAttribute("class", "Table-row-item u-Flex-grow1");
      ratingsColumn.textContent = "Rating";

      /* APPENDS
      ============================================================== */

      // Append the answer and rating columns to the table header
      tableHeader.appendChild(answersColumn);
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

        // Select the table to append rows to
        const answersTable = document.getElementById("answersTable");

        /* CREATES
        ============================================================== */

        // A row with a answer, user and answers
        const tableRow = document.createElement("div");
        tableRow.setAttribute("class", "Table-row");

        // The answer
        const rowItemAnswer = document.createElement("div");
        rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
        rowItemAnswer.setAttribute("data-header", "Answer");
        rowItemAnswer.textContent = answerText;

        // The rating
        const rowItemRating = document.createElement("div");
        rowItemRating.setAttribute("class", "star ui rating Table-row-item u-Flex-grow1");
        rowItemRating.setAttribute("data-header", "Rating");
        rowItemRating.setAttribute("id", answerID);

        /* APPENDS
        ============================================================== */

        // Append the answer, user and rating to that table row
        tableRow.appendChild(rowItemAnswer);
        // Here is where the user will be appended
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

    const rateAnswer = function rateAnswer(ratingElement) {
        let answerID = ratingElement.attr("id");
        let rating = $('#'+answerID).rating('get rating');
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        console.log("Sending user-id request");
        $.getJSON("login/get-userID/"+sessionID, function () {})
        .done(function (data) {
          console.log("Request complete");
          userID = data['userID'];

          let ratingData = {
            "answerID": answerID,
            "userID": userID,
            "rating": rating
          };

          console.log("Sending rating exists request");          
          $.getJSON("rating/get-rating-answer-user/"+answerID+"/"+userID, function () {})
          .done(function (data) {
            console.log("Request complete");
            console.log("Sending insert rating request");
            if (data.length > 0) {
              $.post("rating/update-rating", ratingData, function() {})
              .done(function() {
                  console.log("Request complete");
                  updateRatings(ratingElement);
              })
              .fail(function() {
                  console.log( "error");
              });
            }
            else {
              $.post("rating/insert-rating", ratingData, function() {})
              .done(function() {
                  console.log("Request complete");
                  updateRatings(ratingElement);
              })
              .fail(function() {
                  console.log( "error");
              });
            }
          })
          .fail(function () {
            console.log("error");
          })
        })
        .fail(function () {
          console.log("error");
        })
    };

    const updateAllRatings = function updateAllRatings() {
        $('.ui.rating').each(function( index ) {
            let answerID = $(this).attr("id");
            let ratingElement = $(this);

            $.getJSON( "rating/get-all-ratings/"+answerID, function() {})
            .done(function(data) {
                console.log("Request complete");
                let totalRating = 0;
                let ratingCount = data.length;
                $.each( data, function( key, val ) {
                    totalRating += val["Rating"];
                });
                averageRating = Math.ceil(totalRating / ratingCount);
                ratingElement.rating('set rating', averageRating);
            })
            .fail(function() {
                console.log( "error");
            })
        });
    };

    const updateRatings = function updateRatings(ratingElement) {
        let answerID = ratingElement.attr("id");

        $.getJSON( "rating/get-all-ratings/"+answerID, function() {})
        .done(function(data) {
            console.log("Request complete");
            let totalRating = 0;
            let ratingCount = data.length;
            $.each( data, function( key, val ) {
                totalRating += val["Rating"];
            });
            averageRating = Math.ceil(totalRating / ratingCount);
            ratingElement.rating('set rating', averageRating)
        })
        .fail(function() {
            console.log( "error");
        })
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

        const toggleUI = function() {
          toggleContainer();
          toggleButtons()
              .then(changeText);
        };

        return {
          toggleUI: toggleUI
        }
    }(); // Immediately invoked

    // Grab the question id from the URL
    const getQuestionID = function() {
      var urlParams = new URLSearchParams(window.location.search);
      var urlEntries = urlParams.entries();
      var questionID = "";

      for(let pair of urlEntries) {
        if (pair[0] === "qid")
        {
          questionID = pair[1];
        }
      }
      return questionID;
    };

    // AJAX post answer
    const postAnswer = function (bodyJSON){
      "use strict";
      $.ajax({
        type: 'POST',
        data: bodyJSON,
        url: 'add-answer',
        success: function(data){
          console.log("Answer added successfully");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange");
          console.log('jqXHR: ' + jqXHR);
          console.log('textStatus: ' + textStatus);
          console.log('errorThrown: ' + errorThrown);
        }
      });
    };

    // AJAX get all answers request + not only
    const getAnswers = function() {
      let questionID = getQuestionID();

      if (questionID.length > 0) {
        $.getJSON( "answers/"+questionID, function() {})
          .done(function(data) {
            console.log("Request complete");
            $.each( data, function( key, val ) {
              // First element contains the question text
              if (key === 0) {
                document.getElementById("questionHeading").textContent = val["Question"];
              }
              else {
                viewAnswers.addToTable([val["Answer"], val["ID"]]);
              }
            });

            $('.ui.rating').on("click", function(){
              viewAnswers.rateAnswer($(this));
            });

            $('.ui.rating').rating({
              maxRating: 5
            });

            viewAnswers.updateAllRatings();
            viewAnswers.resolveAnswersArrived(); // All answers arrived, resolve the promise
          })
          .fail(function() {
            unfoldingHeader.unfoldHeader("Error", "orange");
          })
      }

    };

    const resetAnswersPromise = function() {
      // Reset the promise, because once it's fulfilled it can't be reused
      viewAnswers.resolveAnswersArrived = "";
      viewAnswers.rejectAnswersArrived = "";

      viewAnswers.answersArrived = new Promise(function(resolve, reject) {
        viewAnswers.resolveAnswersArrived = resolve;
        viewAnswers.rejectAnswersArrived = reject;
      });
    };

    // Made publicly available
    return {
        // DOM elements that need to be accessed outside the namespace
        addOwnAnswerBtn: addOwnAnswerBtn,
        submitAnswerBtn: submitAnswerBtn,
        cancelAnswerBtn: cancelAnswerBtn,
        addAnswerArea: addAnswerArea,

        // Outside promise for answers arrival
        answersArrived: answersArrived,
        resolveAnswersArrived: resolveAnswersArrived,
        rejectAnswersArrived: rejectAnswersArrived,
        resetAnswersPromise: resetAnswersPromise,

        // Functions
        mkAnswersTableSkeleton: mkAnswersTableSkeleton,
        addToTable: addToTable,
        rmAnswersTable: rmAnswersTable,
        rateAnswer: rateAnswer,
        updateAllRatings: updateAllRatings,
        updateRatings: updateRatings,
        addOwnAnswer: addOwnAnswer,
        getQuestionID: getQuestionID,
        postAnswer: postAnswer,
        getAnswers: getAnswers
    }
}();
//  ============================================================== */

$(document).ready(function() {
    "use strict";
    /* ATTACH EVENT LISTENERS
    ============================================================== */
    viewAnswers.addOwnAnswerBtn.on("click", function(){
      viewAnswers.addOwnAnswer.toggleUI();
    });

    viewAnswers.submitAnswerBtn.on("click", function() {
      if(global.fieldNotEmpty(viewAnswers.addAnswerArea)) {
        // JSON'ize the questionID and answer
        let bodyJSON = {
          questionID: viewAnswers.getQuestionID(),
          answer: viewAnswers.addAnswerArea.val()
        };
        // Send the AJAX request
        viewAnswers.postAnswer(bodyJSON);
        viewAnswers.addOwnAnswer.toggleUI();
        viewAnswers.addAnswerArea.val(''); // Reset textarea

        /* RE-FETCH all the answers
        ============================================================== */
        viewAnswers.rmAnswersTable(); // Remove the answers table from the DOM (so it can be recreated)
        viewAnswers.mkAnswersTableSkeleton(); // Create a new answers table
        viewAnswers.getAnswers(); // Populate the answers table again (with the new answers)

        // Animate-in the newly arrived answers
        viewAnswers.answersArrived.then(function() {
          document.getElementById("answersTable").style.opacity = "1";
          viewAnswers.resetAnswersPromise();
        })
      }
      else {
        unfoldingHeader.unfoldHeader("Please fill in an answer", "red");
      }
    });

    viewAnswers.cancelAnswerBtn.on("click", function() {
      viewAnswers.addAnswerArea.val(''); // Reset textarea
      viewAnswers.addOwnAnswer.toggleUI();
    });

    console.log("Sending get answers request");
    viewAnswers.mkAnswersTableSkeleton(); // Create the answers table skeleton
    viewAnswers.getAnswers(); // Populate the answers table

    // Animate-in the newly arrived answers
    viewAnswers.answersArrived.then(function() {
      document.getElementById("answersTable").style.opacity = "1";
      viewAnswers.resetAnswersPromise();
    });
});