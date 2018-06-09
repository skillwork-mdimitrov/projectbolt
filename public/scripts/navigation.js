const navigation = function() {
    const loadNavigation = function() {
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        let navigationContainer = $("<nav>")
        .attr({ class: "nav" });

        let navigationButtonList = $("<ul>");

        let askQuestionButton = $("<li>")
        .html("Ask a question")
        .click(function() { global.redirect("ask-question") });
        let viewQuestionsButton = $("<li>")
        .html("View questions")
        .click(function() { global.redirect() });
        let chatButton = $("<li>")
        .html("Chat")
        .click(function() { global.redirect("chat") });
        let adminButton = $("<li>")
        .html("Admin")
        .click(function() { global.redirect("admin") });
        let logoutButton = $("<li>")
        .html("Logout")
        .attr({ class: "logoutBtn" })
        .click(function() { global.logout() });

        navigationButtonList.append(askQuestionButton);
        navigationButtonList.append(viewQuestionsButton);
        navigationButtonList.append(chatButton);
        $.getJSON("login/is-admin/"+sessionID, function () {})
        .done(function (isAdmin) {
            if (isAdmin) {
                navigationButtonList.append(adminButton);
            }            
        })
        .fail(function (message) {
            unfoldingHeader.unfoldHeader("Failed determining if admin, see console for details", "red", true);
            console.log("Failed determining if admin: " + message.responseText);
        }) 
        .always(function() {
            navigationButtonList.append(logoutButton);

            navigationContainer.append(navigationButtonList);
            $("#mainContainer").prepend(navigationContainer);                       
        });
    }
    
    return {
        loadNavigation: loadNavigation
    }   
}();

$(document).ready(function () {
	navigation.loadNavigation();
});