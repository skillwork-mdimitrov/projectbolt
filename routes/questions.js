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
          console.log('Handle rejected promise ('+reason+') here.');
          res.status(500).send('Something broke! ' + reason)
    });  
  }
  else {
    res.status(500).send('Invalid request');
  }
});

/* POST a question */
router.post('/add-question/:sessionID', function(req, res) {
  let question = req.body.question; // the one sent from the AJAX's body
  let userID = req.body.userID;
  let sessionID = req.params["sessionID"];

  if (Number.isInteger(parseInt(userID)) && login.sessionValid(sessionID)) {
    database.insertQuestion(question, userID).then(() => {
      res.status(200).send("Insert succesful");
    })
    .catch((reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
      res.status(500).send('Something broke! ' + reason)
    });
  }
  else {
    res.status(500).send('Invalid request');
  }
});

module.exports = router;
