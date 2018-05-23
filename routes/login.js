const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../private/scripts/database');
const login = require('../private/scripts/login');

/* GET login.html page. */
router.get('/', function(req, res, next) {  
  res.sendFile('login.html', { root: path.join(__dirname, '../public') });
});

/* Login */
router.post('/', function(req, res) {
  let username = req.body.username; // credentials sent from client AJAX
  let password = req.body.password;
  let query = "SELECT ID, password FROM Users WHERE Username= '" + username + "'";

  database.getJsonDataSet(query).then((queryResults) => {
    let storedPassword = queryResults[0].password;
    let storedUserID = queryResults[0].ID;

    login.getHash(password).then((hashedPassword) => {
      // Check if passwords match, hash of -1 means hashing failed
      if (hashedPassword !== -1 && hashedPassword === storedPassword) {
        var newSessionID = login.createSession(storedUserID);
        res.send({'sessionID': newSessionID});  
      }
      else
      {
        res.status(500).send('Authentication failure');  
      }
    }).catch((reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
      res.status(500).send('Something broke! ' + reason);
    });
  }).catch((reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
      res.status(500).send('Something broke! ' + reason);
  }); 
});

/* GET session check */
router.get('/check-session/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];
  let sessionValid = login.sessionValid(sessionID);

  res.send({'sessionValid': sessionValid});
});

/* GET username from session */
router.get('/get-username/:sessionID', function(req, res, next) {  
  let sessionID = req.params["sessionID"];
  let sessionData = login.getSessionData(sessionID);
  
  // Check if the session exists
  if (sessionData === undefined) {
    res.status(500).send('Session not found');
  }
  else {
    let userID = sessionData["userID"];
    database.getJsonDataSet("SELECT Username FROM Users WHERE ID = " + userID).then((user) => {
      res.send(user);
    }).catch(
    (reason) => {
      console.log('Handle rejected promise ('+reason+') here.');
      res.status(500).send('Something broke! ' + reason)
    });
  }    
});

/* GET userID from session */
router.get('/get-userID/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];
  let sessionData = login.getSessionData(sessionID);

  // Check if the session exists
  if (sessionData === undefined) {
    res.status(500).send('Session not found');
  }
  else {
    res.send({'userID': sessionData["userID"]});
  }  
});

module.exports = router;