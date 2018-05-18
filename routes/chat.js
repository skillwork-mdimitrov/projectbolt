var express = require('express');
var path = require('path');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
    res.sendFile('chat.html', { root: path.join(__dirname, '../public') });
});  

module.exports = router;