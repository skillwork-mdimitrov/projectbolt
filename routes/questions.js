var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET a promise */
router.get('/get-all-questions', function(req, res, next) {
  database.getAllQuestions().then((questions) => {
    res.json(questions);
  }).catch(
   (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
  });  
});

/* POST a question */
router.post('/add-question', function(req, res) {
  let question = req.body.question; // the one sent from the AJAX's body
  let userID = req.body.userID;
  database.insertQuestion(question, userID).then(() => {
    res.status(200).send("Insert succesful");
  })
  .catch((reason) => {
    console.log('Handle rejected promise ('+reason+') here.');
    res.status(500).send('Something broke! ' + reason)
  });
});

module.exports = router;
