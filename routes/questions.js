var express = require('express');
var database = require('../private/scripts/database');
var login = require('../private/scripts/login');
var similarity = require('../private/scripts/similarity');
var path = require('path');
var router = express.Router();

/* GET a promise */
router.get('/get-all-questions/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];

  if (login.sessionValid(sessionID)) {
    database.getAllNonBannedQuestions().then((questions) => {
      res.json(questions);
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });  
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* GET similarity ratings from all the questions promise */
router.post('/get-similarity', function(req, res, next) {
  let query = req.body.query; 
  let sessionID = req.body.sessionID;

  if (login.sessionValid(sessionID)) {
    similarity.getQuestionSimilarities(query).then((similarities) => {
      res.status(200).send(similarities);
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });  
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* GET the user ID from a specific question promise */
router.get('/get-userid/:questionID/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];
  let questionID = parseInt(req.params["questionID"]);

  if (Number.isInteger(questionID) && 
      login.sessionValid(sessionID)) {
    database.getUserIdByQuestionId(questionID).then((userID) => {
      res.status(200).send(userID[0].UserID.toString());
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });  
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* Get the question ID from question with certain text */
router.post('/get-questionid', function(req, res) {
  let question = req.body.question; 
  let sessionID = req.body.sessionID;

  if (login.sessionValid(sessionID)) {
    database.getQuestionIdByText(question).then((questionID) => {
      res.status(200).send(questionID[0].ID.toString());
    }).catch(() => {
      res.status(500).send(reason.toString());
    })
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* POST a question */
router.post('/add-question', function(req, res) {
  let question = req.body.question; 
  let userID = parseInt(req.body.userID);
  let sessionID = req.body.sessionID;

  if (Number.isInteger(userID) && login.sessionValid(sessionID)) {
    database.insertQuestion(question, userID).then(() => {
      database.getQuestionIdByText(question).then((questionID) => {
        res.status(200).send("Insert successful");
      })
      .catch((reason) => {
        res.status(500).send(reason.toString());
      });
    })
    .catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* DELETE a question */
router.post('/remove-question', function(req, res) {
  let questionID = parseInt(req.body.questionID);
  let sessionID = req.body.sessionID;

  if (Number.isInteger(questionID) && login.sessionValid(sessionID) && login.isTeacher(sessionID)) {
    database.deleteQuestion(questionID).then(() => {
      res.status(200).send("Delete succesful");
    })
    .catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid request');
  }
});

module.exports = router;
