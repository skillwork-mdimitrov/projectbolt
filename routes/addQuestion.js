const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');

/* POST a question */
router.post('/', function(req, res) {
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