var express = require('express');
var database = require('../private/scripts/database');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bolt' });
});

router.post('/sendStatistics', function(req, res, next) {
  let questionsVisitedArr = JSON.parse(req.body.visited); // Array of the visited questions
  let visitsDate = req.body.date; // Date

  // Each questionID in the array will be inserted in the db with the visitsDate
  for(let value of questionsVisitedArr) {
    database.insertVisits(value, visitsDate).then((resolve) => {
      console.log(resolve);
    }).catch((reason) => {
      console.log(reason)
    });
  }
  // TODO: Hook the successful status to a promise when the above loop is done
  res.status(200).send("Stats received");
});

router.get('/allQuestionsStats', function(req, res) {
  database.getVisitsForAllQuestions().then((resolve) => {
    res.json(resolve);
  }).catch((reason) => {
    res.status(500).send(`Couldn't obtain question statistics: ${reason}`);
  })
});

module.exports = router;
