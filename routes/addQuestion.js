const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');

/* GET addQuestions.html page. */
router.get('/', function(req, res, next) {
  res.sendFile('addQuestion.html', { root: path.join(__dirname, '../public') });
});

/* POST a question */
router.post('/', function(req, res) {
  let question = req.body.question; // the one sent from the AJAX's body

  database.runGenericQuery("INSERT INTO Questions (Question) VALUES ('" + question + "')").then((resolve) => {
    res.send(resolve); // to display the successful operation to the client
  })
  .catch((reason) => {
    console.log('Handle rejected promise ('+reason+') here.');
    res.status(500).send('Something broke! ' + reason)
  });
});

module.exports = router;