var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET compare page. */
router.get('/', function(req, res, next) {
  res.sendFile('compare.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;