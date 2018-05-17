const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');

/* POST an answer to a question */
router.post('/', function(req, res) {
  let answer = req.body.answer;
  let questionID = req.body.questionID;

  database.runGenericQuery("INSERT INTO answers (answer, questionid) VALUES ('" + answer + "', '" + questionID + "')")
  .then((resolve) => {
    res.send(resolve); // to display the successful operation to the client
  })
  .catch((reason) => {
    console.log('Handle rejected promise ('+reason+') here.');
    res.status(500).send('Something broke! ' + reason)
  });
});

module.exports = router;
