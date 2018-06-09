const navigation = function() {
    const loadNavigation = function() {
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

        let logoutButton = $("<li>")
        .html("Logout")
        .attr({ class: "logoutBtn" })
        .click(function() { global.logout() });

        navigationButtonList.append(askQuestionButton);
        navigationButtonList.append(viewQuestionsButton);
        navigationButtonList.append(chatButton);
        navigationButtonList.append(logoutButton);

        navigationContainer.append(navigationButtonList);
        $("body").prepend(navigationContainer);
    }
    
    return {
        loadNavigation: loadNavigation
    }   
}();

$(document).ready(function () {
	navigation.loadNavigation();
});