/* Namespace for admin functions
 ============================================================== */
const admin = function () {
    const scriptFilename = "admin.js";

    // Reload the users table to reflect changes in ban status
    const reloadTable = function() {
        $("#userTable tr").remove();
        
        let newRow = $("<tr/>");
        newRow.append($("<th/>").html("User"));
        newRow.append($("<th/>").html("Status"));
        newRow.append($("<th/>").html("Action"));
        $("#userTable").append(newRow);
    };

    // Add user to users table with ban status
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

    // Retrieve and display all the users in the database
    const loadUsers = function() {    
        return new Promise((resolve, reject) => {
            let sessionID = sessionStorage.getItem("projectBoltSessionID");

            reloadTable();

            let getUserDataPromise = $.getJSON("login/get-usernames-status/"+sessionID);
            global.logPromise(getUserDataPromise, scriptFilename, "Requesting user data")
            getUserDataPromise.then((userData) => {
                $.each(userData, function (key, value) {
                    addToTable(value);
                });
        
                $('#userTable :button').on("click", function(){
                    execute($(this));
                });                
                resolve();
            }).catch((reason) => {
                reject(reason);
            });   
        });
    };

    // Execute a ban or unban depedning on the status of the user
    const execute = function(banButton) {
        let userID = banButton.attr("id");
        let sessionID = sessionStorage.getItem("projectBoltSessionID");

        global.showLoader(true);
        
        let banActionPromise = $.post("login/"+banButton.attr("action-url"), { userID: userID, sessionID: sessionID });
        global.logPromise(banActionPromise, scriptFilename, "Sending ban action request");
        banActionPromise.then((message) => {
            loadUsers().then(() => {
                global.hideLoader();
                unfoldingHeader.unfoldHeader(message, "green", true);
            }).catch(() => {
                global.hideLoader();
                unfoldingHeader.unfoldHeader("Failed loading users", "red", true);
            }); 
        }).catch(() => {
            global.hideLoader();
            unfoldingHeader.unfoldHeader("Failed performing ban action", "red");
        });   
    };

    return {
        scriptFilename: scriptFilename,
        loadUsers: loadUsers
    }
}();

$(document).ready(function () {
    let loginCheckPromise = loginCheck.checkLogin();
    let loadNavigationPromise = navigation.loadNavigation();
    let initNotificationsPromise = notifications.initNotifications();

    // Check if user is logged in, load the navigation bar and initialize notifications on this page
    Promise.all([loginCheckPromise, loadNavigationPromise, initNotificationsPromise]).then(() => {
        let sessionID = sessionStorage.getItem("projectBoltSessionID");

        let isAdminPromise = $.getJSON("login/is-admin/"+sessionID);
        global.logPromise(isAdminPromise, admin.scriptFilename, "Requesting user admin status");
        let loadUsersPromise = admin.loadUsers();
        
        // Check if the user is an admin and load the users
        Promise.all([isAdminPromise, loadUsersPromise]).then((values) => {
            let isAdmin = values[0]; // Return value from isAdminPromise
            if (isAdmin) {            
                global.hideLoader();
            }
            else {
                unfoldingHeader.unfoldHeader("Unauthorized access (redirecting in 5 seconds)", "red");
                setTimeout(function(){ global.redirect(""); }, 5000);            
            }
        }).catch(() => {
            unfoldingHeader.unfoldHeader("An error ocurred (redirecting in 5 seconds)", "red");
            setTimeout(function(){ global.redirect(""); }, 5000);
        }); 
    }).catch(() => {
        unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
        setTimeout(function(){ global.logout(); }, 5000);   
    });  
});