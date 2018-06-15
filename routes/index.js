var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bolt' });
});

// TODO do db stuff
router.post('/sendStatistics', function(req, res, next) {
  console.log(req.body);
});

module.exports = router;
