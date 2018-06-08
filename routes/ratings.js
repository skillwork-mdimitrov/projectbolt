var express = require('express');
var database = require('../private/scripts/database');
const login = require('../private/scripts/login');
var path = require('path');
var router = express.Router();

/* GET all the ratings that are not from banned users*/
router.get('/get-all-ratings/:answerID/:sessionID', function(req, res, next) {
    let answerID = req.params["answerID"];
    let sessionID = req.params["sessionID"];

    if (Number.isInteger(parseInt(answerID)) && login.sessionValid(sessionID)) {
        database.getNonBannedRatingsByAnswerId(answerID).then((ratings) => {
            res.json(ratings);
        }).catch((reason) => {
            console.log('Error retrieving ratings of answerID ' + answerID + ': ' + reason);
            res.status(500).send('Something broke! ' + reason);
        }); 
    }
    else {
        res.status(500).send('Invalid request');
    }     
});

/* GET the rating regarding a specific answer and user combination */
router.get('/get-rating-answer-user/:answerID/:sessionID', function(req, res, next) {
    let answerID = req.params["answerID"];
    let sessionID = req.params["sessionID"];

    if (Number.isInteger(parseInt(answerID)) &&
        login.sessionValid(sessionID)) {
        let userID = login.getSessionData(sessionID)["userID"];

        database.getRatingByAnswerIdAndUserId(answerID, userID).then((rating) => {
            res.json(rating);
        }).catch((reason) => {
            console.log('Error retrieving rating of answerID ' + answerID + ' userID ' + userID + ': ' + reason);
            res.status(500).send('Something broke! ' + reason);
        });
    }
    else {
        res.status(500).send('Invalid request');
    }      
});

/* Insert a rating */
router.post('/insert-rating', function(req, res, next) {    
    let answerID = req.body.answerID;
    let rating = req.body.rating;
    let sessionID = req.body.sessionID;

    if (Number.isInteger(parseInt(answerID)) &&
        Number.isInteger(parseInt(rating)) &&
        login.sessionValid(sessionID)) {
        let userID = login.getSessionData(sessionID)["userID"];
        
        database.insertRating(answerID, userID, rating).then(() => {
            res.status(200).send("Insert rating succesful");
        }).catch((reason) => {
            console.log('Error inserting rating of answerID ' + answerID + ' rating ' + rating + ': ' + reason);
            res.status(500).send('Something broke! ' + reason);
        }); 
    }
    else {
        res.status(500).send('Invalid request');
    }    
});

/* Update a rating */
router.post('/update-rating', function(req, res, next) {    
    let answerID = req.body.answerID;
    let rating = req.body.rating;
    let sessionID = req.body.sessionID;

    if (Number.isInteger(parseInt(answerID)) &&
        Number.isInteger(parseInt(rating)) &&
        login.sessionValid(sessionID)) {
        let userID = login.getSessionData(sessionID)["userID"];

        database.updateRating(answerID, userID, rating).then(() => {
            res.status(200).send("Update rating succesful");
        }).catch((reason) => {
            console.log('Error updating rating of answerID ' + answerID + ' rating ' + rating + ': ' + reason);
            res.status(500).send('Something broke! ' + reason);
        }); 
    }
    else {
        res.status(500).send('Invalid request');
    }    
});

module.exports = router;