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
            console.log('Handle rejected promise ('+reason+') here.');
            res.status(500).send('Something broke! ' + reason)
        }); 
    }
    else {
        res.status(500).send('Invalid request');
    }     
});

/* GET the rating regarding a specific answer and user combination */
router.get('/get-rating-answer-user/:answerID/:userID/:sessionID', function(req, res, next) {
    let answerID = req.params["answerID"];
    let userID = req.params["userID"];
    let sessionID = req.params["sessionID"];

    if (Number.isInteger(parseInt(answerID)) &&
        Number.isInteger(parseInt(userID)) &&
        login.sessionValid(sessionID)) {
        database.getRatingByAnswerIdAndUserId(answerID, userID).then((rating) => {
            res.json(rating);
        }).catch((reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
            res.status(500).send('Something broke! ' + reason)
        });
    }
    else {
        res.status(500).send('Invalid request');
    }      
});

/* Insert a rating */
router.post('/insert-rating', function(req, res, next) {    
    let answerID = req.body.answerID;
    let userID = req.body.userID;
    let rating = req.body.rating;
    let sessionID = req.body.sessionID;

    if (Number.isInteger(parseInt(answerID)) &&
        Number.isInteger(parseInt(userID)) &&
        Number.isInteger(parseInt(rating)) &&
        login.sessionValid(sessionID)) {
        database.insertRating(answerID, userID, rating).then(() => {
            res.status(200).send("Insert succesful");
        }).catch((reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
            res.status(500).send('Something broke! ' + reason)
        }); 
    }
    else {
        res.status(500).send('Invalid request');
    }    
});

/* Update a rating */
router.post('/update-rating', function(req, res, next) {    
    let answerID = req.body.answerID;
    let userID = req.body.userID;
    let rating = req.body.rating;
    let sessionID = req.body.sessionID;

    if (Number.isInteger(parseInt(answerID)) &&
        Number.isInteger(parseInt(userID)) &&
        Number.isInteger(parseInt(rating)) &&
        login.sessionValid(sessionID)) {
        database.updateRating(answerID, userID, rating).then(() => {
            res.status(200).send("Update succesful");
        }).catch((reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
            res.status(500).send('Something broke! ' + reason)
        }); 
    }
    else {
        res.status(500).send('Invalid request');
    }    
});

module.exports = router;