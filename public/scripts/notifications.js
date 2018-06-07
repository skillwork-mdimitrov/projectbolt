/* notifications NAMESPACE
============================================================== */
const notifications = function() {
    const notificationSocket = io('/notifications');

    const initNotifications = function(isTeacher, userID) {
        if (isTeacher) {
            notificationSocket.on('newQuestion', function (data) {
                unfoldingHeader.unfoldHeader("New question: " + data.question, "green", false, "answers.html?qid=" + data.questionID);
            });
        }      
        notificationSocket.on('newAnswer', function (data) {
            let sessionID = sessionStorage.getItem('projectBoltSessionID');
            $.getJSON("login/get-userID/"+sessionID, function () {})
            .done(function (userID) {
                // If you asked the question with a new answer
                if (userID.userID === data.userID) {
                    unfoldingHeader.unfoldHeader(data.username + " answered your question: " + data.question, "green", false, "answers.html?qid=" + data.questionID);
                }                
            })
            .fail(function (message) {
                unfoldingHeader.unfoldHeader("Failed retrieving user id, see console for details", "red", true);
                console.log("Failed retrieving user id: " + message.responseText);   
            })
        });  
    };    

    const getNotificationSocket = function() {
        return notificationSocket;
    };    

    return {
        initNotifications: initNotifications,
        getNotificationSocket: getNotificationSocket
    };
}();

$(document).ready(function() {
    let sessionID = sessionStorage.getItem('projectBoltSessionID');

    console.log("Checking if user is a teacher")
    $.getJSON("login/is-teacher/"+sessionID, function () {})
    .done(function (isTeacher) {
        console.log("Retrieving user ID")
        $.getJSON("login/get-userID/"+sessionID, function () {})
        .done(function (userData) {
            notifications.initNotifications(isTeacher, userData.userID);
        })
        .fail(function (message) {
            unfoldingHeader.unfoldHeader("Failed retrieving user ID, see console for details", "red", true);
            console.log("Failed retrieving user ID: " + message.responseText);  
        })
    })
    .fail(function (message) {
        unfoldingHeader.unfoldHeader("Failed checking user role, see console for details", "red", true);
        console.log("Failed checking user role: " + message.responseText);  
    })
});