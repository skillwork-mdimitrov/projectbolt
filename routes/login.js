const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');

/* GET login.html page. */
router.get('/', function(req, res, next) {
  res.sendFile('login.html', { root: path.join(__dirname, '../public') });
});

/* Login */
router.post('/', function(req, res) {
  let username = req.body.username; // the one sent from the AJAX's body
  //let hashedPass = req.body.password;
  console.log(username);
  res.send({sessionID: "randomID"});


});

module.exports = router;