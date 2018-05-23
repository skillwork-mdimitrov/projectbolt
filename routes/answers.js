var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET the answers from a specific question (ID) */
router.get('/:questionID', function(req, res, next) {
  let questionID = req.params["questionID"]; 

  if (!isNaN(questionID))
  {
    database.getQuestionTextById(questionID).then((questionText) => {
      database.getAnswersByQuestionId(questionID).then((answers) => {
        res.json(questionText.concat(answers));
      }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason);
      });
    }).catch((reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
      res.status(500).send('Something broke! ' + reason);
    });
  }
  else
  {
    console.log('Invalid ID');
    res.status(500).send('Something broke! Invalid ID');
  }     
});

module.exports = router;