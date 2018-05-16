var express = require('express');
var path = require('path');
var router = express.Router();

/* GET addQuestions.html page. */
router.get('/', function(req, res, next) {
  res.sendFile('addQuestion.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;