var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET the answers from a specific question (ID) */
router.get('/:questionID', function(req, res, next) {
  database.getJsonDataSet("SELECT Question FROM Questions WHERE ID in (" + req.params["questionID"] + ")").then((question) => {
    var questionText = question;
    database.getJsonDataSet("SELECT * FROM Answers WHERE QuestionID in (" + req.params["questionID"] + ")").then((answers) => {
      res.json(questionText.concat(answers));
    }).catch((reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
      res.status(500).send('Something broke! ' + reason)
    });
  }).catch((reason) => {
    console.log('Handle rejected promise ('+reason+') here.');
    res.status(500).send('Something broke! ' + reason)
  });   
});

module.exports = router;