var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET all the ratings */
router.get('/get-all-ratings/:answerID', function(req, res, next) {
    database.getJsonDataSet("SELECT Rating FROM Ratings WHERE AnswerID = " + req.params["answerID"]).then((ratings) => {
        res.json(ratings);
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    });  
});

/* Insert a rating */
router.post('/insert-rating', function(req, res, next) {    
    database.runGenericQuery("INSERT INTO Ratings (AnswerID, UserID, Rating) VALUES (" 
                                                                + req.body.answerID + ", " 
                                                                + req.body.userID + ", " 
                                                                + req.body.rating 
                                                                + ")").then(() => {
        res.status(200).send("Insert succesful");
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    }); 
});

module.exports = router;