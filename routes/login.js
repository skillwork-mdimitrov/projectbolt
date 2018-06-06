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

  database.getIdPasswordByUsername(username).then((userData) => {
    let storedPassword = userData[0].password;
    let storedUserID = userData[0].ID;

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
      res.status(500).send(reason.toString());
    });
  }).catch((reason) => {
    res.status(500).send(reason.toString());
  }); 
});

/* GET session check */
router.get('/check-session/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];
  res.send({'sessionValid': login.sessionValid(sessionID)});
});

/* GET username from session */
router.get('/get-username/:sessionID', function(req, res, next) {  
  let sessionID = req.params["sessionID"];
    
  // Check if the session is valid
  if (login.sessionValid(sessionID)) {
    database.getUsernameById(login.getSessionData(sessionID)["userID"]).then((username) => {
      res.send(username);
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid session');
  }    
});

/* GET user is admin or not from session ID */
router.get('/is-admin/:sessionID', function(req, res, next) {  
  let sessionID = req.params["sessionID"];
  
  // Check if the session is valid
  if (login.sessionValid(sessionID)) {
    login.isAdmin(sessionID).then((isAdmin) => {
      res.send(isAdmin);
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid session');
  }    
});

/* GET user is teacher or not from session ID */
router.get('/is-teacher/:sessionID', function(req, res, next) {  
  let sessionID = req.params["sessionID"];
  
  // Check if the session is valid
  if (login.sessionValid(sessionID)) {
    login.isTeacher(sessionID).then((isTeacher) => {
      res.send(isTeacher);
    }).catch(
    (reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid session');
  }    
});

/* GET userID from session */
router.get('/get-userID/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];

  // Check if the session is valid
  if (login.sessionValid(sessionID)) {
    res.send({'userID': login.getSessionData(sessionID)["userID"]});
  }
  else {
    res.status(500).send('Invalid session');
  }  
});

/* GET id, username and ban status from all users */
router.get('/get-usernames-status/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];

  // Check if the session is valid and user is admin
  if (login.sessionValid(sessionID)) {
    database.getUsernamesBannedStatus().then((users) => {
      res.json(users);
    }).catch((reason) => {
      res.status(500).send(reason.toString());
    });    
  }
  else {
    res.status(500).send('Invalid session');
  }     
});

/* Get individual user's banned status from sessionID */
router.get('/get-banned-status/:sessionID', function(req, res, next) {
  let sessionID = req.params["sessionID"];

  // Check if the session is valid and user is admin
  if (login.sessionValid(sessionID)) {
    database.getUserBannedStatusById(login.getSessionData(sessionID)["userID"]).then((bannedStatus) => {
      res.send(bannedStatus);
    }).catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid session');
  } 
});

/* Ban a user */
router.post('/ban-user', function(req, res, next) {
  let sessionID = req.body.sessionID;

  // Check if the session is valid and user is admin
  if (login.sessionValid(sessionID)) {
    login.isAdmin(sessionID).then((isAdmin) => {
      if (isAdmin) {
        database.banUser(req.body.userID).then(() => {
          res.status(200).send("Ban succesful");
        }).catch((reason) => {
          res.status(500).send(reason.toString());
        }); 
      }
      else {
        res.status(500).send('Unauthorized access');
      }        
    }).catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid session');
  } 
});

/* Unban a user */
router.post('/unban-user', function(req, res, next) {
  let sessionID = req.body.sessionID;

  // Check if the session is valid and user is admin
  if (login.sessionValid(sessionID)) {
    login.isAdmin(sessionID).then((isAdmin) => {
      if (isAdmin) {
        database.unbanUser(req.body.userID).then(() => {
          res.status(200).send("Ban succesful");
        }).catch((reason) => {
          res.status(500).send(reason.toString());
        });  
      }
      else {
        res.status(500).send('Unauthorized access');
      }        
    }).catch((reason) => {
      res.status(500).send(reason.toString());
    });
  }
  else {
    res.status(500).send('Invalid session');
  } 
});

module.exports = router;