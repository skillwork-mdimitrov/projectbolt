/* notifications NAMESPACE
============================================================== */
const notifications = function() {
    const scriptFilename = "notifications.js";
    const notificationSocket = io('/notifications');

    const initNotifications = function(isTeacher, userID) {
        return new Promise((resolve, reject) => {
            notificationSocket.on('newAnswer', function (answerData) {
                let sessionID = sessionStorage.getItem('projectBoltSessionID');

                let userIdPromise = $.get("login/get-userID/"+sessionID);
                global.logPromise(userIdPromise, scriptFilename, "Requesting user ID");

                userIdPromise.then((userID) => {
                    if (parseInt(userID) === answerData.userID) {
                        unfoldingHeader.unfoldHeader(answerData.username + " answered your question: " + answerData.question,
                                                    "green", 
                                                    false, 
                                                    "answers.html?qid=" + answerData.questionID);
                    }  
                }).catch(() => {
                    unfoldingHeader.unfoldHeader("Failed retrieving user id", "red");
                })
            });

            let sessionID = sessionStorage.getItem('projectBoltSessionID');

            let isTeacherPromise = $.get("login/is-teacher/"+sessionID);
            global.logPromise(isTeacherPromise, scriptFilename, "Requesting user teacher status");

            isTeacherPromise.then((isTeacher) => {
                if (isTeacher) {
                    notificationSocket.on('newQuestion', function (questionData) {
                        unfoldingHeader.unfoldHeader("New question: " + questionData.question, 
                                                    "green", 
                                                    false, 
                                                    "answers.html?qid=" + questionData.questionID);
                    });
                }      
                resolve();
            }).catch(() => {
                reject();
            });        
        });
    };     

    return {
        initNotifications: initNotifications,
        notificationSocket: notificationSocket
    };
}();