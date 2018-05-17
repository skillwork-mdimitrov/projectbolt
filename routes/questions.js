var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET a promise */
router.get('/get-all-questions', function(req, res, next) {
  database.getJsonDataSet("SELECT * FROM Questions").then((questions) => {
    res.json(questions);
  }).catch(
   (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
  });  
});

module.exports = router;
