const navigation = function() {
    const scriptFilename = "navigation.js";

    const loadNavigation = function() {
        return new Promise((resolve, reject) => {
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

            let isAdminPromise = $.get("login/is-admin/"+sessionID);
            global.logPromise(isAdminPromise, scriptFilename, "Requesting admin status")
            let firstnamePromise = $.get("login/get-firstname/"+sessionID);
            global.logPromise(firstnamePromise, scriptFilename, "Requesting first name")

            Promise.all([isAdminPromise, firstnamePromise]).then((values) => {
                let isAdmin = values[0];    // Return value from isAdminPromise
                let firstname = values[1];  // Return value from firstnamePromise

                let userWelcome = $("<li>")
                .html("Welcome " + firstname + "!");
                
                navigationButtonList.append(userWelcome);   
                navigationButtonList.append(askQuestionButton);
                navigationButtonList.append(viewQuestionsButton);
                navigationButtonList.append(chatButton);   
                if (isAdmin) {
                    navigationButtonList.append(adminButton);
                }           
                navigationButtonList.append(logoutButton);

                navigationContainer.append(navigationButtonList);
                $("#mainContainer").prepend(navigationContainer);      
                resolve();  
            }).catch(() => {
                unfoldingHeader.unfoldHeader("An error ocurred", "red");
                reject();
            });
        });
    }
    
    return {
        loadNavigation: loadNavigation
    }   
}();