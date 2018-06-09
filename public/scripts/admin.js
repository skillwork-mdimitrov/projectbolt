const admin = function () {
    const reloadTable = function() {
        $("#userTable tr").remove();
        
        let newRow = $("<tr/>");
        newRow.append($("<th/>").html("User"));
        newRow.append($("<th/>").html("Status"));
        newRow.append($("<th/>").html("Action"));
        $("#userTable").append(newRow);
    };

    const addToTable = function(userData) {
        newRow = $("<tr/>");

        newRow.append($("<td/>").html(userData.Username));
        
        let userSatus = $("<td/>");
        if (userData.Banned) {
            userSatus.html("Banned");
        }
        else {
            userSatus.html("Active");
        }
        newRow.append(userSatus);
        
        let banButton = $("<button/>");
        banButton.attr("id", userData.ID);
        if (userData.Banned) {
            banButton.html("Unban");
            banButton.attr("action-url", "unban-user"); 
        }
        else {
            banButton.html("Ban");   
            banButton.attr("action-url", "ban-user"); 
        }                
        newRow.append($("<td/>").html(banButton));

        $("#userTable").append(newRow);
    }

    const loadUsers = function() {    
        return new Promise((resolve, reject) => {
            let sessionID = sessionStorage.getItem("projectBoltSessionID");

            reloadTable();

            let getUserDataPromise = $.getJSON("login/get-usernames-status/"+sessionID);
            global.logPromise(getUserDataPromise, "Requesting user data")
            getUserDataPromise.then((userData) => {
                $.each(userData, function (key, value) {
                    addToTable(value);
                });
        
                $('#userTable :button').on("click", function(){
                    execute($(this));
                });                
                resolve();
            }).catch((reason) => {
                reject(reason.responseText);
            });   
        });
    };

    const execute = function(banButton) {
        let userID = banButton.attr("id");
        let buttonText = banButton.text();
        let sessionID = sessionStorage.getItem("projectBoltSessionID");

        global.showLoader();
        
        let banActionPromise = $.post("login/"+banButton.attr("action-url"), { userID: userID, sessionID: sessionID });
        global.logPromise(banActionPromise, "Sending ban action request");
        banActionPromise.then((message) => {
            loadUsers().then(() => {
                global.hideLoader();
                unfoldingHeader.unfoldHeader(message, "green");
            }).catch((reason) => {
                unfoldingHeader.unfoldHeader("Failed loading users: " + reason, "red");
            }); 
        }).catch((reason) => {
            unfoldingHeader.unfoldHeader("Failed performing ban action: " + reason.responseText, "red");
        });   
    };

    return {
        loadUsers: loadUsers
    }
}();

$(document).ready(function () {
    let sessionID = sessionStorage.getItem("projectBoltSessionID");

    let isAdminPromise = $.getJSON("login/is-admin/"+sessionID);
    let loadNavigationPromise = navigation.loadNavigation();
    let loadUsersPromise = admin.loadUsers();

    global.logPromise(isAdminPromise, "Requesting user admin status");
    Promise.all([isAdminPromise, loadNavigationPromise, loadUsersPromise]).then((values) => {
        let isAdmin = values[0]; // Return value from isAdminPromise
        if (isAdmin) {            
            global.hideLoader();
        }
        else {
            global.redirect("");
        }
    }).catch((reason) => {
        console.log(reason);
    }); 
});