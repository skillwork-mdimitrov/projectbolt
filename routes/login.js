const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');

const serverLogin = function(){
  let dateObj = new Date();
  let sessionData = {};
  let previousID = 0;
  let timelimit = 900000;

  const createSession = function(username){
    previousID = previousID++;
    dateNow = dateObj.now();
    sessionData[previousID] = {'timestamp': dateNow, 'username': username};
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
    if(password == queryResults.password){
      serverLogin.createSession(username);
    }
  }).catch(
      (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
      });
  res.send({sessionID: serverLogin.previousID});
  console.log(serverLogin.previousID);


});

module.exports = router;