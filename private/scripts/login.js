var bcrypt = require('bcrypt');
var database = require('./database');

var sessionData = {};
// Starting session ID
var nextSessionID = 0;
// 15 minute session duration
var sessionTimeout = 900000;
// Pre defined hashing salt for user passwords
var hashingSalt = "$2b$10$HsyAVPkQft2HZybIRduZUO";

// Create a new session for a user that is logging in
function createSession(userID) {
    var currentDateTime = new Date();
    var currentSessionID = nextSessionID;

    sessionData[currentSessionID] = {'created': currentDateTime, 'userID': userID};
    nextSessionID++;

    return currentSessionID;
};

// Check if a session is still valid based on the timeout value
function sessionValid(sessionID) {
    if (sessionData[sessionID] !== undefined) {
        var sessionCreatedDateTime = sessionData[sessionID]['created'];
        var currentDateTime = new Date();
        var dateTimeDifference = getTimeDifference(sessionCreatedDateTime, currentDateTime);

        if (dateTimeDifference > sessionTimeout) {
            return false;
        }
        else {
            sessionData[sessionID]['created'] = currentDateTime;
            return true;
        }
    }
    else {
        return false;
    }
}

// Compute the hash of a password, making use of the pre-defined salt
function getHash(inputString) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(inputString, hashingSalt, function(err, hash) {
            if (err) {
                reject("Hashing failed");
            }        
            else {
                resolve(hash);
            }                
        });       
    });
}

function getSessionData(sessionID) {
    return sessionData[sessionID];
}

// Helper function for time differentials in absolute milliseconds
function getTimeDifference(dateA, dateB) {
    var utcA = Date.UTC(dateA.getFullYear(), 
                        dateA.getMonth(), 
                        dateA.getDate(), 
                        dateA.getHours(), 
                        dateA.getMinutes(), 
                        dateA.getSeconds());
    var utcB = Date.UTC(dateB.getFullYear(), 
                        dateB.getMonth(), 
                        dateB.getDate(), 
                        dateB.getHours(), 
                        dateB.getMinutes(), 
                        dateB.getSeconds());

    return Math.floor(utcB - utcA);
}

// Check if a session belongs to an admin (roleID 3)
function isAdmin(sessionID) {
    return new Promise((resolve, reject) => {
        database.getUserRoleById(sessionData[sessionID]["userID"]).then((userRole) => {
            resolve(userRole[0].RoleID === 3);
        })
        .catch((reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
            reject(reason);
        });
    });
}

// Check if a session belongs to a teacher (roleID 2)
function isTeacher(sessionID) {
    return new Promise((resolve, reject) => {
        database.getUserRoleById(sessionData[sessionID]["userID"]).then((userRole) => {
            resolve(userRole[0].RoleID === 2);
        })
        .catch((reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
            reject(reason);
        });
    });
}
  
// Function definitions for accessing in other scripts

exports.createSession = createSession;
exports.sessionValid = sessionValid;  
exports.getHash = getHash;
exports.getSessionData = getSessionData;
exports.isAdmin = isAdmin;
exports.isTeacher = isTeacher;