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

/* GET the userID from a specific answer */
router.get('/get-userID/:answerID/:sessionID', function(req, res, next) {
  let answerID = req.params["answerID"]; 
  let sessionID = req.params["sessionID"];

  if (Number.isInteger(parseInt(answerID)) && 
      login.sessionValid(sessionID))
  {
    database.getUserIdByAnswerId(answerID).then((userID) => {
      res.status(200).send(userID);
    }).catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid request');
  }     
});

/* Get the answer ID from answer with certain text */
router.post('/get-answerid', function(req, res) {
  let answer = req.body.answer; 
  let sessionID = req.body.sessionID;

  if (login.sessionValid(sessionID)) {
    database.getAnswerIdByText(answer).then((answerID) => {
      res.status(200).send(answerID[0].ID.toString());
    }).catch(() => {
      res.status(500).send(reason.toString());
    })
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* Get the username from answer with certain text */
router.post('/get-username', function(req, res) {
  let answer = req.body.answer; 
  let questionID = parseInt(req.body.questionID);
  let sessionID = req.body.sessionID;

  if (login.sessionValid(sessionID)) {
    database.getUsernameByAnswer(questionID, answer).then((username) => {
      console.log(username);
      res.status(200).send(username.toString());
    }).catch(() => {
      res.status(500).send(reason.toString());
    })
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* POST an answer to a question */
router.post('/add-answer', function(req, res) {
  let answer = req.body.answer;
  let questionID = parseInt(req.body.questionID);
  let userID = parseInt(req.body.userID);
  let sessionID = req.body.sessionID;

  if (Number.isInteger(questionID) &&
      Number.isInteger(userID) && 
      login.sessionValid(sessionID)) {
    database.getUserIdByQuestionId(questionID).then((questionUserIDJSON) => {
      let questionUserID = questionUserIDJSON[0].UserID;

      if (questionUserID !== userID) {
        database.insertAnswer(answer, questionID, userID).then(() => {
          res.status(200).send("Insert successful");
        })
        .catch((reason) => {
          res.status(500).send(reason.toString())
        });
      }
      else {
        res.status(500).send("Not allowed to answer own questions");
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