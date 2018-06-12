var express = require('express');
const path = require('path');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
    res.sendFile('askQuestion.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;