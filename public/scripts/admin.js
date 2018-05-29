const admin = function () {
    const loadUsers = function() {    
        var sessionID = sessionStorage.getItem("projectBoltSessionID");

        $("#userTable tr").remove();
        
        var newRow = $("<tr/>");
        newRow.append($("<th/>").html("User"));
        newRow.append($("<th/>").html("Status"));
        newRow.append($("<th/>").html("Action"));
        $("#userTable").append(newRow);

        console.log("Sending request");
        $.getJSON("login/get-usernames-status/"+sessionID, function () {})
        .done(function (data) {
            console.log("Request complete");
            $.each(data, function (key, val) {
                newRow = $("<tr/>");

                newRow.append($("<td/>").html(val.Username));
                
                var userSatus = $("<td/>");
                if (val.Banned) {
                    userSatus.html("Banned");
                }
                else {
                    userSatus.html("Active");
                }
                newRow.append(userSatus);
                
                var banButton = $("<button/>");
                banButton.attr("id", val.ID);
                if (val.Banned) {
                    banButton.html("Unban");    
                }
                else {
                    banButton.html("Ban");    
                }                
                newRow.append($("<td/>").html(banButton));

                $("#userTable").append(newRow);
            });
    
            $('#userTable :button').on("click", function(){
                admin.banUser($(this));
            });
        })
        .fail(function () {
            console.log("error");
        })
    };

    const banUser = function(banButton) {
        var userID = banButton.attr("id");
        var buttonText = banButton.text();
        var sessionID = sessionStorage.getItem("projectBoltSessionID");

        if (buttonText === "Ban") {
            $.post("login/ban-user", { userID: userID, sessionID: sessionID }, function() {})
            .done(function() {
                console.log("Request complete");
                loadUsers();
            })
            .fail(function() {
                console.log( "error");
            });
        }
        if (buttonText === "Unban") {
            $.post("login/unban-user", { userID: userID, sessionID: sessionID }, function() {})
            .done(function() {
                console.log("Request complete");
                loadUsers();
            })
            .fail(function() {
                console.log( "error");
            });
        }
    };

    return {
        loadUsers: loadUsers,
        banUser: banUser
    }
}();

$(document).ready(function () {
    var sessionID = sessionStorage.getItem("projectBoltSessionID");

    $.getJSON("login/is-admin/"+sessionID, function () {})
    .done(function (isAdmin) {
        console.log("Request complete");
        if (isAdmin) {
            admin.loadUsers();
        }
        else {
            global.redirect("");
        }
    })
    .fail(function () {
        console.log("error");
    })    
});