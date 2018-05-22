/* viewAnswers, also addAnswers NAMESPACE
 ============================================================== */
const viewAnswers = function() {
    // DOM selectors
    const addOwnAnswerBtn = $('#addOwnAnswerBtn');
    const addAnswerContainer = $('#addAnswerContainer');
    const addAnswerArea = $('#addAnswerArea');
    const submitAnswerBtn = $('#submitAnswerBtn');
    const cancelAnswerBtn = $('#cancelAnswerBtn');

    const addToTable = function(answer) {
        let answerText = answer[0];
        let answerID = answer[1];
    
        let answersTable = document.getElementById("answersTable");
    
        // A row with a answer, user and answers
        let tableRow = document.createElement("div");
        tableRow.setAttribute("class", "Table-row");
    
        // The answer
        let rowItemAnswer = document.createElement("div");
        rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
        rowItemAnswer.setAttribute("data-header", "Answer");
        rowItemAnswer.textContent = answerText;

        // The rating
        let rowItemRating = document.createElement("div");
        rowItemRating.setAttribute("class", "star ui rating Table-row-item u-Flex-grow1");
        rowItemRating.setAttribute("data-header", "Rating");
        rowItemRating.setAttribute("id", answerID);
    
        // Append the answer, user and answer to that table row
        tableRow.appendChild(rowItemAnswer);
        tableRow.appendChild(rowItemRating);
    
        // Append the row to the table
        answersTable.appendChild(tableRow);
    };

    const rateAnswer = function rateAnswer(ratingElement) {
        let answerID = ratingElement.attr("id");
        let postData = {
            "answerID": answerID,
            "userID": 1,
            "rating": $('#'+answerID).rating('get rating')
        };        

        console.log("Sending request");
        $.post( "rating/insert-rating", postData, function() {})
        .done(function() {
            console.log("Request complete");
            updateRatings(ratingElement);
        })
        .fail(function() {
            console.log( "error");
        });
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
          unfoldingHeader.unfoldHeader("Answer added successfully", "green");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          unfoldingHeader.unfoldHeader('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!', "orange");
          console.log('jqXHR: ' + jqXHR);
          console.log('textStatus: ' + textStatus);
          console.log('errorThrown: ' + errorThrown);
        }
      });
    };

    // Made publicly available
    return {
        // DOM elements that need to be accessed outside the namespace
        addOwnAnswerBtn: addOwnAnswerBtn,
        submitAnswerBtn: submitAnswerBtn,
        cancelAnswerBtn: cancelAnswerBtn,
        addAnswerArea: addAnswerArea,

        // Functions
        addToTable: addToTable,
        rateAnswer: rateAnswer,
        updateAllRatings: updateAllRatings,
        updateRatings: updateRatings,
        addOwnAnswer: addOwnAnswer,
        getQuestionID: getQuestionID,
        postAnswer: postAnswer,
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
      }
      else {
        unfoldingHeader.unfoldHeader("Please fill in an answer", "red");
      }
    });

    viewAnswers.cancelAnswerBtn.on("click", function() {
      viewAnswers.addAnswerArea.val(''); // Reset textarea
      viewAnswers.addOwnAnswer.toggleUI();
    });

    console.log("Sending request");

    let questionID = viewAnswers.getQuestionID();

    if (questionID.length > 0)
    {
        $.getJSON( "answers/"+questionID, function() {})
        .done(function(data) {
              console.log("Request complete");
              $.each( data, function( key, val ) {
                // First element contains the question text
                if (key === 0)
                {
                    document.getElementById("questionHeading").textContent = val["Question"];
                }
                else
                {
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
            })
        .fail(function() {
              console.log( "error");
        }) 
    }
});