var express = require('express');
var path = require('path');
var router = express.Router();

/* GET questions page. */
router.get('/', function(req, res, next) {
  res.sendFile('questions.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;
