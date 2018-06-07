var express = require('express');
var database = require('../private/scripts/database');
const login = require('../private/scripts/login');
var path = require('path');
var router = express.Router();

/* GET the answers from a specific question (ID) */
router.get('/:questionID/:sessionID', function(req, res, next) {
  let questionID = req.params["questionID"]; 
  let sessionID = req.params["sessionID"];

  if (Number.isInteger(parseInt(questionID)) && 
      login.sessionValid(sessionID))
  {
    database.getQuestionTextById(questionID).then((questionText) => {
      database.getNonBannedAnswersByQuestionId(questionID).then((answers) => {
        res.json(questionText.concat(answers));
      }).catch((reason) => {
        res.status(500).send(reason.toString());
      });
    }).catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid request');
  }     
});

/* POST an answer to a question */
router.post('/add-answer', function(req, res) {
  let answer = req.body.answer;
  let questionID = req.body.questionID;
  let userID = req.body.userID;
  let sessionID = req.body.sessionID;

  if (Number.isInteger(parseInt(questionID)) &&
      Number.isInteger(parseInt(userID)) && 
      login.sessionValid(sessionID)) {
    database.insertAnswer(answer, questionID, userID).then(() => {
      database.getUsernameByAnswer(questionID, answer).then((username) => {
        res.status(200).send({ response: "Insert successful", username: username });
      })
      .catch((reason) => {
        res.status(500).send(reason.toString());
      });
    })
    .catch((reason) => {
      res.status(500).send(reason.toString())
    });
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* DELETE an answer */
router.post('/remove-answer', function(req, res) {
    let answerID = req.body.answerID;
    let sessionID = req.body.sessionID;

    if (Number.isInteger(parseInt(answerID)) && login.sessionValid(sessionID)) {
      login.isTeacher(sessionID).then((isTeacher) => {
        if (isTeacher) {
          database.deleteAnswer(answerID).then(() => {
            res.status(200).send("Delete successful");
          })
          .catch((reason) => {
            res.status(500).send(reason.toString());
          });
        }
        else {
          res.status(500).send('Invalid request');
        }        
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