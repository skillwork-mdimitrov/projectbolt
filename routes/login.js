const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');

const serverLogin = function(){
  let sessionData = {};
  let previousID = 0;
  let timelimit = 900000;

  const createSession = function(username){
    serverLogin.previousID = serverLogin.previousID + 1;
    let dateObj = new Date();
    sessionData[previousID] = {'timestamp': dateObj.getTime(), 'username': username};
  };

  return{
    previousID,
    sessionData,
    createSession
  }
}();


/* GET login.html page. */
router.get('/', function(req, res, next) {
  res.sendFile('login.html', { root: path.join(__dirname, '../public') });
});

/* Login */
router.post('/', function(req, res) {
  let username = req.body.username; // the one sent from the AJAX's body
  let password = req.body.password;
  let query = "SELECT password FROM Users WHERE Username= '" + username + "'";

  database.getJsonDataSet(query).then((queryResults) => {
    if(password == queryResults[0].password){
      serverLogin.createSession(username);
      console.log("passwords match!");
      res.send({'sessionID': serverLogin.previousID});
      console.log("id: " +  serverLogin.previousID);
    }
  }).catch(
      (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
      });



});

module.exports = router;