var bcrypt = require('bcrypt');
var database = require('./database');

var sessionData = {};
var nextSessionID = 0;
// 15 minute session duration
var sessionTimeout = 900000;
var hashingSalt = "$2b$10$HsyAVPkQft2HZybIRduZUO";

function createSession(userID) {
    var currentDateTime = new Date();
    var currentSessionID = nextSessionID;

    sessionData[currentSessionID] = {'created': currentDateTime, 'userID': userID};
    nextSessionID++;

    return currentSessionID;
};

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
  
exports.createSession = createSession;
exports.sessionValid = sessionValid;  
exports.getHash = getHash;
exports.getSessionData = getSessionData;
exports.isAdmin = isAdmin;
exports.isTeacher = isTeacher;