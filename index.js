/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* LEGEND, COMMENTS
   ============================================================== */
// HC = Hard coded

/* VARIABLES
   ============================================================== */
let selectingQueries = require('./server/sqlCommands/selectingQueries');
let insertingQueries = require('./server/sqlCommands/insertingQueries');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// =====================================================================================================================

/* SERVER
   ============================================================== */
// Will handle every STATIC file placed in the public directory. Scripts that have to deal with the database are NOT static
app.use(express.static('public'));

// Posting request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/dynamic_request_fetchDB', function(request, response) {
  "use strict";
  let toWrite = "";
  selectingQueries.getResultsAsArray("SELECT question FROM questions"); // select every question from the database and store it in dbResults array
  selectingQueries.dataLoading.then(function(resolve) {
    toWrite = resolve.join(); // since response needs to return a string, join() the array results
    response.write(toWrite); // return the results from the resolvement of the promise (the dbResults array) to the client
    response.end();
  })
  .catch(function (error) {
    toWrite = error.message; // if the promise returns an error, catch it
    response.write(toWrite); // return the error message to the client
    response.end();
  });
});

app.get('/fetchAllQuestions', function(request, response) {
  "use strict";
  let toWrite = "";
  selectingQueries.getResultsAsJSON("SELECT id, question FROM questions"); // select every question from the database and store it in dbResults array
  selectingQueries.dataLoading.then(function(resolve) {
    toWrite = resolve;
    response.json(resolve);
  })
  .catch(function (error) {
    toWrite = error.message; // if the promise returns an error, catch it
    response.write(toWrite); // return the error message to the client
    response.end();
  });
});

app.get('/fetchAllUsers', function(request, response) {
  "use strict";
  let toWrite = "";
  selectingQueries.getResultsAsLayeredArray("SELECT id, firstname FROM users"); // select every question from the database and store it in dbResults array
  selectingQueries.dataLoading.then(function(resolve) {
    toWrite = resolve;
    response.json(resolve);
  })
  .catch(function (error) {
    toWrite = error.message; // if the promise returns an error, catch it
    response.write(toWrite); // return the error message to the client
    response.end();
  });
});

app.get('/fetchAllAnswers', function(request, response) {
  "use strict";
  let toWrite = "";
  selectingQueries.getResultsAsJSON("SELECT id, answer FROM answers"); // select every question from the database and store it in dbResults array
  selectingQueries.dataLoading.then(function(resolve) {
    toWrite = resolve;
    response.json(resolve);
  })
  .catch(function (error) {
    toWrite = error.message; // if the promise returns an error, catch it
    response.write(toWrite); // return the error message to the client
    response.end();
  });
});

app.post('/fetchQuestionAnswer', function(request, response) {
  "use strict";
  let toWrite = "";
  let theRequestedQuestion = request.body.question;
  selectingQueries.getResultsAsArray("SELECT answer FROM answers WHERE QuestionID=" + "'" + theRequestedQuestion + "'");
  selectingQueries.dataLoading.then(function(resolve) {
    toWrite = resolve.join(); // since response needs to return a string, join() the array results
    response.write(toWrite); // return the results from the resolvement of the promise (the answer) to the client
    response.end();
  })
  .catch(function (error) {
    toWrite = error.message; // if the promise returns an error, catch it
    response.write(toWrite); // return the error message to the client
    response.end();
  });
});

/* INSERTING INTO THE DB EXAMPLE METHOD
   ============================================================== */
/*
  // This will fail if what you try to INSERT already exists in the database
  let tableName = "questions"; // info like this can come from the body of your AJAX request
  insertingQueries.insertStatement("INSERT INTO " + tableName + " (question) VALUES ('Test11')");
  insertingQueries.insertion.then(function(resolve) {
    console.log(resolve); // write this resolve back to the user, like response.write(resolve) maybe
  })
  .catch(function (error) {
    console.log("Insert failed - " + error.message); // re-write this in the response.write("Msg " + error)
  });
*/

// Writting answers in the database ----!!Need to check if the data go in the dB
app.post('/dynamic_request_writeToDB', function(request, response) {
  "use strict";
  let answer = request.body.answer;
  console.log(answer);
  insertingQueries.insertStatement("INSERT INTO answers (answer, questionid) VALUES (" + "'" + answer + "'" + ", '1')");
  insertingQueries.insertion.then(function(resolve) {
    console.log(resolve); // write this resolve back to the user, like response.write(resolve) maybe
  })
  .catch(function (error) {
    console.log("Insert failed - " + error.message); // re-write this in the response.write("Msg " + error)
  });
  response.end("A OK");
});


// Writing question in the database ----!!Need to check if the data go in the dB
app.post('/request_writing_question_todb', function(request, response) {
  "use strict";
  let question = request.body.question;
  insertingQueries.insertStatement("INSERT INTO questions (question) VALUES (" + "'" + question + "'" + ")");
  insertingQueries.insertion.then(function(resolve) {
    console.log(resolve); // write this resolve back to the user, like response.write(resolve) maybe
  })
  .catch(function (error) {
    console.log("Insert failed - " + error.message); // re-write this in the response.write("Msg " + error)
  });
  response.end("Request send");
});

// Writing rating in the database ----!!Need to check if the data go in the dB
app.post('/request_writing_rating_todb', function(request, response) {
  "use strict";
  let answerID = request.body.answer;
  let userID = request.body.user;
  let rating = request.body.rating;

  insertingQueries.insertStatement("INSERT INTO ratings (answerid, userid, rating) VALUES (" + answerID + ", " + userID + ", " + rating + ")");
  insertingQueries.insertion.then(function(resolve) {
    console.log(resolve); // write this resolve back to the user, like response.write(resolve) maybe
  })
  .catch(function (error) {
    console.log("Insert failed - " + error.message); // re-write this in the response.write("Msg " + error)
  });
  response.end("Request send");
});

// =====================================================================================================================

/* PORT
   ============================================================== */
// Specify port
var port = process.env.PORT || 1337;
// Listen to port
app.listen(port, function() {
  "use strict";
  console.log("Server running at http://localhost:%d", port);
});
// =====================================================================================================================
