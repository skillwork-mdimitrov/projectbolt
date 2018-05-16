var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET rating page. */
router.get('/', function(req, res, next) {
  res.sendFile('rating.html', { root: path.join(__dirname, '../public') });
});

/* GET all the answers */
router.get('/get-all-answers', function(req, res, next) {
    database.getJsonDataSet("SELECT * FROM Answers").then((answers) => {
        res.json(answers);
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    });  
});

/* GET all the users */
router.get('/get-all-users', function(req, res, next) {
    database.getJsonDataSet("SELECT * FROM Users").then((users) => {
        res.json(users);
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    });  
});

/* GET all the users */
router.get('/insert-rating/:answerID/:userID/:rating', function(req, res, next) {
    if (!isNaN(req.params["answerID"]) && !isNaN(req.params["userID"]) &&!isNaN(req.params["rating"]))
    {
        database.runGenericQuery("INSERT INTO Ratings (AnswerID, UserID, Rating) VALUES (" + 
                                                                    req.params["answerID"] + ", " 
                                                                    + req.params["userID"] + ", " 
                                                                    + req.params["rating"] 
                                                                    + ")").then(() => {
            res.status(200).send("Insert succesful");
        }).catch((reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
            res.status(500).send('Something broke! ' + reason)
        }); 
    }
    else
    {
        console.log('Illegal input');
        res.status(500).send('Something broke! Illegal input')
    }
});

module.exports = router;