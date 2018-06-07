var express = require('express');
var database = require('../private/scripts/database');
const login = require('../private/scripts/login');
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

/* GET a promise */
router.get('/get-userid/:questionID/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];
  let questionID = req.params["questionID"];

  if (Number.isInteger(parseInt(questionID)) && 
      login.sessionValid(sessionID)) {
    database.getUserIdByQuestionId(questionID).then((userID) => {
      res.json(userID);
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });  
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* POST a question */
router.post('/add-question', function(req, res) {
  let question = req.body.question; // the one sent from the AJAX's body
  let userID = req.body.userID;
  let sessionID = req.body.sessionID;

  if (Number.isInteger(parseInt(userID)) && login.sessionValid(sessionID)) {
    database.insertQuestion(question, userID).then(() => {
      database.getQuestionIdByText(question).then((questionID) => {
        res.status(200).send({ response: "Insert successful", question: question, questionID: questionID });
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
  let questionID = req.body.questionID;
  let sessionID = req.body.sessionID;

  if (Number.isInteger(parseInt(questionID)) && login.sessionValid(sessionID) && login.isTeacher(sessionID)) {
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
