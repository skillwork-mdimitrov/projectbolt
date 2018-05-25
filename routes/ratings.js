var express = require('express');
var database = require('../private/scripts/database');
var path = require('path');
var router = express.Router();

/* GET all the ratings */
router.get('/get-all-ratings/:answerID', function(req, res, next) {
    database.getRatingsByAnswerId(req.params["answerID"]).then((ratings) => {
        res.json(ratings);
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    });  
});

/* GET the rating regarding a specific answer and user combination */
router.get('/get-rating-answer-user/:answerID/:userID', function(req, res, next) {
    database.getRatingByAnswerIdAndUserId(req.params["answerID"], req.params["userID"]).then((rating) => {
        res.json(rating);
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    });  
});

/* Insert a rating */
router.post('/insert-rating', function(req, res, next) {    
    database.insertRating(req.body.answerID, req.body.userID, req.body.rating).then(() => {
        res.status(200).send("Insert succesful");
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    }); 
});

/* Update a rating */
router.post('/update-rating', function(req, res, next) {    
    database.updateRating(req.body.answerID, req.body.userID, req.body.rating).then(() => {
        res.status(200).send("Update succesful");
    }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.status(500).send('Something broke! ' + reason)
    }); 
});

module.exports = router;