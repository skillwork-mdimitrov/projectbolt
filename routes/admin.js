var express = require('express');
const path = require('path');
var router = express.Router();

/* GET admin page. */
router.get('/', function(req, res, next) {
    res.sendFile('admin.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;
