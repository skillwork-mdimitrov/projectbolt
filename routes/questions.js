var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET questions page. */
router.get('/', function(req, res, next) {
  res.sendFile('questions.html', { root: path.join(__dirname, '../public') });
});

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

module.exports = router;
