const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../private/scripts/database');

const serverLogin = function(){
  let sessionData = {};
  let nextSessionID = 0;
  // 15 minute session duration
  let sessionTimeout = 900000;
  let hashingSalt = "$2b$10$HsyAVPkQft2HZybIRduZUO";

  const createSession = function(userID) {
    let currentDateTime = new Date();
    let currentSessionID = nextSessionID;
    sessionData[currentSessionID] = {'created': currentDateTime, 'userID': userID};
    nextSessionID++;
    return currentSessionID;
  };

  const getTimeDifference = function(dateA, dateB) {
    var utcA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), dateA.getHours(), dateA.getMinutes(), dateA.getSeconds());
    var utcB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), dateB.getHours(), dateB.getMinutes(), dateB.getSeconds());
    return Math.floor(utcB - utcA);
  }

  const sessionValid = function(sessionID) {
    if (sessionData[sessionID] !== undefined)
    {
      let sessionCreatedDateTime = sessionData[sessionID]['created'];
      let currentDateTime = new Date();
      let dateTimeDifference = getTimeDifference(sessionCreatedDateTime, currentDateTime);
      if (dateTimeDifference > sessionTimeout)
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  }

  return{
    sessionData: sessionData,
    hashingSalt: hashingSalt,
    createSession: createSession,
    sessionValid: sessionValid
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
  let query = "SELECT ID, password FROM Users WHERE Username= '" + username + "'";

  database.getJsonDataSet(query).then((queryResults) => {
    let storedPassword = queryResults[0].password;
    let storedUserID = queryResults[0].ID;
    bcrypt.hash(password, serverLogin.hashingSalt, function(err, hash) {
      if (hash === storedPassword) {
        var newSessionID = serverLogin.createSession(storedUserID);
        res.send({'sessionID': newSessionID});  
      }
      else
      {
        res.status(500).send('Invalid password')  
      }
    }); 
  }).catch(
      (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
      });
});

/* GET session check */
router.get('/check-session/:sessionID', function(req, res, next) {  
  let sessionID = req.params["sessionID"];
  let sessionValid = serverLogin.sessionValid(sessionID);
  res.send({'sessionValid': sessionValid});
});

module.exports = router;